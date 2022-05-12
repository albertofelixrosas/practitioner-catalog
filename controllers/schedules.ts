import { ScheduleInstance } from '../models/schedule';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';

interface IFindAndCountAllData {
    count: number;
    rows: ScheduleInstance[];
}

const getPagination = (page: number | undefined, size: number | undefined) => {
    const limit = size ? size : undefined;
    const offset = page && limit ? page * limit : undefined;
    return { limit, offset };
};

const getPagingData = (
    sqlData: IFindAndCountAllData,
    page: number | undefined,
    limit: number | undefined
) => {
    const { count: totalItems, rows: practitioners } = sqlData;
    const currentPageIndex = page;
    const totalPages = limit ? Math.ceil(totalItems / limit) : undefined;
    return { totalItems, practitioners, totalPages, currentPageIndex };
};

export const getSchedules = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ ...errors });
    }

    try {
        const page = req.query.page
            ? parseInt(req.query.page as unknown as string)
            : undefined;
        const size = req.query.size
            ? parseInt(req.query.size as unknown as string)
            : undefined;
        const name = req.query.name as unknown as string;
        const { limit, offset } = getPagination(page, size);
        const results = await ScheduleInstance.findAndCountAll({
            ...(!limit ? { limit: 10 } : { limit }),
            ...(!offset ? { offset: 0 } : { offset }),
            // This way you can exclude fields from the database.
            // attributes: {
            //     exclude: ['isactive', 'createdAt', 'updatedAt'],
            // },
            where: {
                [Op.and]: {
                    ...(!name
                        ? {}
                        : {
                              firstName: {
                                  [Op.like]: `%${name.toString().trim()}%`,
                              },
                          }),
                },
            },
        });
        const paginatedData = getPagingData(results, page, limit);
        res.status(200).json(paginatedData);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            msg: `Error: ${error}`,
        });
    }
};

export const getSchedule = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await ScheduleInstance.findOne({
            attributes: {
                exclude: ['isactive', 'createdAt', 'updatedAt'],
            },
            where: {
                id: id,
            },
        });

        if (!result) {
            return res.status(404).json({
                msg: `There is no schedule with the id ${id}`,
            });
        }

        res.status(200).json(result);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            msg: `Error: ${error}`,
        });
    }
};

export const postSchedule = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ ...errors });
    }

    try {
        const practitioner = await ScheduleInstance.create(req.body);
        res.status(201).json({ practitioner });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            msg: `Error: ${error}`,
        });
    }
};

export const putSchedule = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ ...errors });
    }

    try {
        const { id: schedulePk } = req.params;
        const schedule = await ScheduleInstance.findByPk(schedulePk);

        if (!schedule) {
            return res.status(400).json({
                value: schedulePk,
                msg: `The schedule with id '${schedulePk}' does not exist`,
                param: 'id',
                location: 'params',
            });
        }

        await schedule.update(req.body);
        res.status(202).json({ schedule });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            msg: `Error: ${error}`,
        });
    }
};

export const toggleActiveSchedule = async (req: Request, res: Response) => {
    try {
        const { id: schedulePk } = req.params;
        const schedule = await ScheduleInstance.findOne({
            where: {
                id: schedulePk,
            },
        });
        if (!schedule) {
            return res.status(400).json({
                value: schedulePk,
                msg: `The practitioner with id '${schedulePk}' does not exist`,
                param: 'schedule',
                location: 'params',
            });
        }

        const newActiveValue = !schedule.getDataValue('isactive');
        await schedule.update(
            {
                isactive: newActiveValue,
            },
            {
                where: {
                    id: [schedulePk],
                },
            }
        );

        res.status(202).json({ practitioner: schedule });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            msg: `Error: ${error}`,
        });
    }
};
