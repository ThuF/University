/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();
var studentsDaoExtensionsUtils = require('university/utils/studentsDaoExtensionUtils');

// Create an entity
exports.create = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'INSERT INTO STUDENTS (ID,AGE,FIRST_NAME,LAST_NAME) VALUES (?,?,?,?)';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = datasource.getSequence('STUDENTS_ID').next();
        statement.setInt(++i, id);
        statement.setShort(++i, entity.age);
        statement.setString(++i, entity.first_name);
        statement.setString(++i, entity.last_name);
		studentsDaoExtensionsUtils.beforeCreate(connection, entity);
        statement.executeUpdate();
        studentsDaoExtensionsUtils.afterCreate(connection, entity);
    	return id;
    } finally {
        connection.close();
    }
};

// Return a single entity by Id
exports.get = function(id) {
	var entity = null;
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT * FROM STUDENTS WHERE ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, id);

        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            entity = createEntity(resultSet);
        }
    } finally {
        connection.close();
    }
    return entity;
};

// Return all entities
exports.list = function(limit, offset, sort, desc) {
    var result = [];
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT ';
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genTopAndStart(limit, offset);
        }
        sql += ' * FROM STUDENTS';
        if (sort !== null) {
            sql += ' ORDER BY ' + sort;
        }
        if (sort !== null && desc !== null) {
            sql += ' DESC ';
        }
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genLimitAndOffset(limit, offset);
        }
        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
    } finally {
        connection.close();
    }
    return result;
};

// Update an entity by Id
exports.update = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'UPDATE STUDENTS SET   AGE = ?, FIRST_NAME = ?, LAST_NAME = ? WHERE ID = ?';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setShort(++i, entity.age);
        statement.setString(++i, entity.first_name);
        statement.setString(++i, entity.last_name);
        statement.setInt(++i, entity.id);
		studentsDaoExtensionsUtils.beforeUpdate(connection, entity);
        statement.executeUpdate();
        studentsDaoExtensionsUtils.afterUpdate(connection, entity);
    } finally {
        connection.close();
    }
};

// Delete an entity
exports.delete = function(entity) {
    var connection = datasource.getConnection();
    try {
    	var sql = 'DELETE FROM STUDENTS WHERE ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setString(1, entity.id);
        studentsDaoExtensionsUtils.beforeDelete(connection, entity);
        statement.executeUpdate();
        studentsDaoExtensionsUtils.afterDelete(connection, entity);
    } finally {
        connection.close();
    }
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM STUDENTS';
        var statement = connection.prepareStatement(sql);
        var rs = statement.executeQuery();
        if (rs.next()) {
            count = rs.getInt(1);
        }
    } finally {
        connection.close();
    }
    return count;
};

// Returns the metadata for the entity
exports.metadata = function() {
	var metadata = {
		name: 'students',
		type: 'object',
		properties: [
		{
			name: 'id',
			type: 'smallint',
			key: 'true',
			required: 'true'
		},
		{
			name: 'age',
			type: 'smallint'
		},
		{
			name: 'first_name',
			type: 'string'
		},
		{
			name: 'last_name',
			type: 'string'
		},
		]
	};
	return metadata;
};

// Create an entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
    result.id = resultSet.getShort('ID');
    result.age = resultSet.getShort('AGE');
    result.first_name = resultSet.getString('FIRST_NAME');
    result.last_name = resultSet.getString('LAST_NAME');
    return result;
}

