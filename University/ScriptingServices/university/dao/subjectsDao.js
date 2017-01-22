/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();
var subjectsDaoExtensionsUtils = require('university/utils/subjectsDaoExtensionUtils');

// Create an entity
exports.create = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'INSERT INTO SUBJECTS (ID,NAME,DESCRIPTION) VALUES (?,?,?)';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = datasource.getSequence('SUBJECTS_ID').next();
        statement.setInt(++i, id);
        statement.setString(++i, entity.name);
        statement.setString(++i, entity.description);
		subjectsDaoExtensionsUtils.beforeCreate(connection, entity);
        statement.executeUpdate();
        subjectsDaoExtensionsUtils.afterCreate(connection, entity);
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
        var sql = 'SELECT * FROM SUBJECTS WHERE ID = ?';
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
        sql += ' * FROM SUBJECTS';
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
        var sql = 'UPDATE SUBJECTS SET   NAME = ?, DESCRIPTION = ? WHERE ID = ?';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, entity.name);
        statement.setString(++i, entity.description);
        statement.setInt(++i, entity.id);
		subjectsDaoExtensionsUtils.beforeUpdate(connection, entity);
        statement.executeUpdate();
        subjectsDaoExtensionsUtils.afterUpdate(connection, entity);
    } finally {
        connection.close();
    }
};

// Delete an entity
exports.delete = function(entity) {
    var connection = datasource.getConnection();
    try {
    	var sql = 'DELETE FROM SUBJECTS WHERE ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setString(1, entity.id);
        subjectsDaoExtensionsUtils.beforeDelete(connection, entity);
        statement.executeUpdate();
        subjectsDaoExtensionsUtils.afterDelete(connection, entity);
    } finally {
        connection.close();
    }
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM SUBJECTS';
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
		name: 'subjects',
		type: 'object',
		properties: [
		{
			name: 'id',
			type: 'smallint',
			key: 'true',
			required: 'true'
		},
		{
			name: 'name',
			type: 'string'
		},
		{
			name: 'description',
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
    result.name = resultSet.getString('NAME');
    result.description = resultSet.getString('DESCRIPTION');
    return result;
}

