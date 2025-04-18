module.exports = (sequelize, DataTypes) => {
	const role = sequelize.define(
		'role',
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
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			/**
			 * By default, sequelize will automatically transform all passed model names into plural
			 * References: https://sequelize.org/master/manual/model-basics.html#table-name-inference
			 */
			tableName: 'role',
			timestamps: true,
		}
	);

	role.associate = (models) => {
		role.hasMany(models.user, {
			foreignKey: 'id',
			onDelete: 'RESTRICT',
			onUpdate: 'CASCADE',
		});
		role.belongsToMany(models.permission, {
			through: 'role_to_permission',
		});
	};

	return role;
};
