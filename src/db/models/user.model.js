const { baseFields } = require('./base_model');

module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define(
		'user',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			first_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			last_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			image: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			is_logged: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			role_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'role',
					key: 'id',
				},
				onDelete: 'RESTRICT',
				onUpdate: 'CASCADE',
			},
			...baseFields.status,
		},
		{
			tableName: 'user',
			timestamps: true,
			defaultScope: {
				attributes: { exclude: ['password'] },
			},
			// if want to get password then use user.scope('withPassword').findOne()
			scopes: {
				withPassword: {
					attributes: {},
				},
			},
			// indexes: [
			// 	{
			// 		fields: ['email'],
			// 		unique: true,
			// 	},
			// 	{
			// 		fields: ['status'],
			// 	},
			// ],
		}
	);

	user.associate = (models) => {
		user.belongsTo(models.role, {
			foreignKey: 'role_id',
			onDelete: 'RESTRICT',
			onUpdate: 'CASCADE',
		});

		user.hasOne(models.token);
	};

	return user;
};
