import { Router } from 'express';
import {
    getSchedule,
    getSchedules,
    postSchedule,
    putSchedule,
    toggleActiveSchedule,
} from '../controllers/schedules';
import { body, query } from 'express-validator';

const router = Router();

router.get(
    '/',
    query('page', 'The page parameter must be a non-negative numeric value')
        .optional()
        .isInt({ min: 0 }),
    query(
        'size',
        'The size parameter must be a numeric value and at least its value must be 1'
    )
        .optional()
        .isInt({ min: 1 }),
    query(
        'name',
        'The name cannot be empty and cannot have a length greater than 15'
    )
        .optional()
        .isString()
        .isLength({ min: 1, max: 15 }),
    getSchedules
);
router.get('/:id', getSchedule);
router.post(
    '/',
    body(
        'name',
        'The name cannot be empty and cannot have a length greater than 15'
    )
        .trim()
        .isLength({ min: 1, max: 15 }),
    body(
        'description',
        'The description cannot be empty and cannot have a length greater than 150'
    )
        .trim()
        .isLength({ min: 1, max: 150 }),
    body(
        'abbreviation',
        'The abbreviation cannot be empty and cannot have a length greater than 5'
    )
        .trim()
        .isLength({ min: 1, max: 5 }),
    postSchedule
);
router.put(
    '/:id',
    body(
        'name',
        'The name cannot be empty and cannot have a length greater than 15'
    )
        .trim()
        .isLength({ min: 1, max: 15 }),
    body(
        'description',
        'The description cannot be empty and cannot have a length greater than 150'
    )
        .trim()
        .isLength({ min: 1, max: 150 }),
    body(
        'abbreviation',
        'The abbreviation cannot be empty and cannot have a length greater than 5'
    )
        .trim()
        .isLength({ min: 1, max: 5 }),
    putSchedule
);
//router.delete('/:id', () => {});
router.put('/toggleActive/:id', toggleActiveSchedule);

export default router;
