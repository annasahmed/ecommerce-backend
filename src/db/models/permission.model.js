export default (sequelize, DataTypes) => {
    const permission = sequelize.define(
        'permission',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            parent: {
                type: DataTypes.STRING,
                allowNull: true
            },
        },
        {
            tableName: 'permission',
            timestamps: true,
        }
    );

    permission.associate = (models) => {
        permission.belongsToMany(models.role, {
            through: 'role_to_permission',
        });
    };

    return permission;
};
