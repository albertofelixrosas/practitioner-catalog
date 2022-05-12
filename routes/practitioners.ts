import { Router } from 'express';
import {
    getPractitioners,
    getPractitioner,
    postPractitioner,
    putPractitioner,
    toggleActivePractitioner,
} from '../controllers/practitioners';
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
        'firstname',
        'The firstname cannot be empty and cannot have a length greater than 50'
    )
        .optional()
        .isString()
        .isLength({ min: 1, max: 50 }),
    query(
        'lastname',
        'The lastname cannot be empty and cannot have a length greater than 50'
    )
        .optional()
        .isString()
        .isLength({ min: 1, max: 50 }),
    query(
        'email',
        'The email cannot be empty and cannot have a length greater than 80'
    )
        .optional()
        .trim()
        .isString()
        .isLength({ min: 1, max: 80 }),
    getPractitioners
);
router.get('/:id', getPractitioner);
router.post(
    '/',
    body(
        'schedule',
        'The schedule must be a number since it is a numeric primary key'
    ).isInt({ min: 1 }),
    body(
        'firstname',
        'The firstname cannot be empty and cannot have a length greater than 50'
    )
        .trim()
        .isLength({ min: 1, max: 50 }),
    body(
        'lastname',
        'The lastname cannot be empty and cannot have a length greater than 50'
    )
        .trim()
        .isLength({ min: 1, max: 50 }),
    body(
        'gender',
        'The gender must be a boolean value, because it represents the male and female gender'
    ).isBoolean(),
    body('email', 'The email must have a valid format').trim().isEmail(),
    body(
        'phonenumber',
        'The phonenumber must have a valid format'
    ).isMobilePhone('any'),
    body(
        'interbankcode',
        'The interbank code is a number of exactly 18 characters'
    )
        .optional()
        .trim()
        .isLength({ min: 18, max: 18 }),
    body('birthdate', 'The birthdate has to be a valid date')
        .optional()
        .isDate(),
    postPractitioner
);
router.put(
    '/:id',
    body(
        'schedule',
        'The schedule must be a number since it is a numeric primary key'
    )
        .optional()
        .isNumeric(),
    body(
        'firstname',
        'The firstname cannot be empty and cannot have a length greater than 50'
    )
        .optional()
        .isLength({ min: 1, max: 50 }),
    body(
        'lastname',
        'The lastname cannot be empty and cannot have a length greater than 50'
    )
        .optional()
        .isLength({ min: 1, max: 50 }),
    body(
        'gender',
        'The gender must be a boolean value, because it represents the male and female gender'
    )
        .optional()
        .isBoolean(),
    body('email', 'The email must have a valid format').optional().isEmail(),
    body('phonenumber', 'The phonenumber must have a valid format')
        .optional()
        .isMobilePhone('any'),
    body(
        'interbankcode',
        'The interbank code is a number of exactly 18 characters'
    )
        .optional()
        .isLength({ min: 18, max: 18 }),
    body('birthdate', 'The birthdate has to be a valid date')
        .optional()
        .isDate(),
    putPractitioner
);
router.put('/toggleActive/:id', toggleActivePractitioner);

export default router;
