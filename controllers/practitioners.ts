import { PractitionerInstance } from '../models/practitioner';
import { ScheduleInstance } from '../models/schedule';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';

// 8. query params with express js orm sequelize
// https://youtu.be/IPC-jZbafOk

interface IFindAndCountAllData {
    count: number;
    rows: object;
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

export const getPractitioners = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    console.log(JSON.stringify(errors));
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
        const firstName = req.query.firstName as unknown as string;
        const lastName = req.query.lastName as unknown as string;
        const email = req.query.email as unknown as string;
        const { limit, offset } = getPagination(page, size);
        const results = await PractitionerInstance.findAndCountAll({
            ...(!limit ? { limit: 10 } : { limit }),
            ...(!offset ? { offset: 0 } : { offset }),
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            where: {
                [Op.and]: {
                    ...(!firstName
                        ? {}
                        : {
                              firstName: {
                                  [Op.like]: `%${firstName.toString().trim()}%`,
                              },
                          }),
                    ...(!lastName
                        ? {}
                        : {
                              lastName: {
                                  [Op.like]: `%${lastName.toString().trim()}%`,
                              },
                          }),
                    ...(!email
                        ? {}
                        : {
                              email: {
                                  [Op.like]: `%${email.toString().trim()}%`,
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

export const getPractitioner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log(id);
        const result = await PractitionerInstance.findOne({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            where: {
                id: id,
            },
        });

        if (!result) {
            return res.status(404).json({
                msg: `There is no practitioner with the id ${id}`,
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

export const postPractitioner = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ ...errors });
    }

    try {
        const { schedule: schedulePk } = req.body;
        const schedule = await ScheduleInstance.count({
            where: {
                id: schedulePk,
            },
        });
        if (!schedule) {
            return res.status(400).json({
                value: schedulePk,
                msg: `The schedule with id '${schedulePk}' does not exist`,
                param: 'schedule',
                location: 'body',
            });
        }
        const practitioner = await PractitionerInstance.create(req.body);
        res.status(201).json({ practitioner });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            msg: `Error: ${error}`,
        });
    }
};

export const putPractitioner = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ ...errors });
    }

    try {
        const { id: practitionerPk } = req.params;
        const practitioner = await PractitionerInstance.findByPk(
            practitionerPk
        );

        if (!practitioner) {
            return res.status(400).json({
                value: practitionerPk,
                msg: `The practitioner with id '${practitionerPk}' does not exist`,
                param: 'schedule',
                location: 'params',
            });
        }
        // VALIDATE SHCEDULE
        const { schedule: schedulePk } = req.body;
        if (schedulePk) {
            const schedule = await ScheduleInstance.count({
                where: {
                    id: schedulePk,
                },
            });
            if (!schedule) {
                return res.status(400).json({
                    value: schedulePk,
                    msg: `The schedule with id '${schedulePk}' does not exist`,
                    param: 'schedule',
                    location: 'body',
                });
            }
        }

        await practitioner.update(req.body);
        res.status(202).json({ practitioner });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            msg: `Error: ${error}`,
        });
    }
};

export const toggleActivePractitioner = async (req: Request, res: Response) => {
    try {
        const { id: practitionerPk } = req.params;
        const practitioner = await PractitionerInstance.findOne({
            where: {
                id: practitionerPk,
            },
        });
        if (!practitioner) {
            return res.status(400).json({
                value: practitionerPk,
                msg: `The practitioner with id '${practitionerPk}' does not exist`,
                param: 'schedule',
                location: 'params',
            });
        }

        const newActiveValue = !practitioner.getDataValue('isactive');
        console.log(newActiveValue);
        await practitioner.update(
            {
                isactive: newActiveValue,
            },
            {
                where: {
                    id: [practitionerPk],
                },
            }
        );

        res.status(202).json({ practitioner });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            msg: `Error: ${error}`,
        });
    }
};
