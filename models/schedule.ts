import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../db/connection';

/*
-id
-description
-name
-abbreviation
*/

export interface ScheduleAttributes {
    id: number;
    description: string;
    name: string;
    abbreviation: string;
    isactive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class ScheduleInstance extends Model<ScheduleAttributes> {}

ScheduleInstance.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        abbreviation: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isactive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
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
        tableName: 'schedules',
        sequelize: db,
    }
);
