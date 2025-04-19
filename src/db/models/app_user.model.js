const { baseFields, baseScopes } = require('./base_model');

module.exports = (sequelize, DataTypes) => {
	const app_user = sequelize.define(
		'app_user',
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
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
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
			...baseFields,
		},
		{
			/**
			 * By default, sequelize will automatically transform all passed model names into plural
			 * References: https://sequelize.org/master/manual/model-basics.html#table-name-inference
			 */
			tableName: 'app_user',
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
			...baseScopes(true),
		}
	);
	app_user.associate = (models) => {
		app_user.hasOne(models.token);
	};

	return app_user;
};
