import db from '../db/connection';

import { DataTypes, Model } from 'sequelize';
// Build a bullet proof REST API with Typescript, Express.js and Sequelize with Sqlite3 |CRUD REST API
// https://youtu.be/yFgrSJGNj0E

export interface PractitionerAttributes {
    id: number;
    schedule: number;
    firstname: string;
    lastname: string;
    gender: boolean;
    email: string;
    phonenumber: string;
    interbankcode?: string;
    birthdate?: Date;
    isactive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class PractitionerInstance extends Model<PractitionerAttributes> {}

PractitionerInstance.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        schedule: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phonenumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        interbankcode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        birthdate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isactive: {
            type: DataTypes.BOOLEAN,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'practitioners',
        sequelize: db,
    }
);
