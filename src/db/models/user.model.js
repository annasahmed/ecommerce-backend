const { baseFields, baseScopes } = require("./base_model");

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
			tableName: 'user',
			timestamps: true,
			defaultScope: {
				attributes: { exclude: ['password'] },
			},
			// if want to get password then use cms_user.scope('withPassword').findOne()
			scopes: {
				withPassword: {
					attributes: {},
				},
			},
			...baseScopes(true),

		}
	);
	user.associate = (models) => {
		user.hasOne(models.token);
	};

	return user;
};
