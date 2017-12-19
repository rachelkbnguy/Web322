
//using sequelize
const Sequelize = require('sequelize');
var sequelize = new Sequelize('d4dk1cb1hv0rcf', 'zxbokgfuanokve', '569e5659a45f4706dc677d2e0a5322db387725af552be29951c9ae8a2f7689a4', {
    host: 'ec2-54-235-219-113.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});
sequelize
.authenticate()
.then(()=> {
    console.log('Connection has been established successfully.');
})
.catch((err)=> {
    console.log('Unable to connect to the database:', err);
});
var Employee = sequelize.define('Employee',{
    employeeNum:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    matritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
    }, {
        createdAt: false, // disable createdAt
        updatedAt: false // disable updatedAt
});

var Department = sequelize.define('Department',{
    departmentId:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
    }, {
        createdAt: false, // disable createdAt
        updatedAt: false // disable updatedAt
});
// synchronize the Database with our models and automatically add the 
// table if it does not exist

module.exports.initialize = ()=>{
        return new Promise(function (resolve, reject) {  
            sequelize.sync().then((Employee)=>{          
                console.log("Employee's data is opened!");
                resolve();
                }).then((Department)=> {
                console.log("Department's data is opened!")
                resolve();
                }).catch((err)=> {
                console.log("something went wrong!");
                reject();
            });              
    });
}

module.exports.getAllEmployees = ()=>{
    return new Promise((resolve,reject)=>{
        sequelize.sync().then(() => {
            resolve(Employee.findAll());
        }).catch((err) => {
            reject("Sorry! No results returned =.=");
        });
    });
}
module.exports.getEmployeesByStatus=(status)=>{
    return new Promise((resolve,reject)=>{
    sequelize.sync().then(() => {
        resolve(Employee.findAll({
            where:{status: status}}));
    }).catch((err) => {
            reject("No Result Returned");   
    });
    });
}

module.exports.getEmployeesByDepartment=(department)=>{
    return new Promise((resolve,reject)=>{
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where:{department: department}}));
            }).catch((err) => {
            reject("Sorry! No results returned =.=");
        });
    });
}
module.exports.getEmployeesByManager=(manager)=>{
    return new Promise((resolve,reject)=>{
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where:{employeeManagerNum: manager}
            }));
            }).catch((err) => {
            reject("Sorry! No results returned =.=");
        });
    });
}
module.exports.getEmployeeByNum=(eNum)=>{
    return new Promise((resolve,reject)=>{
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where:{employeeNum: eNum}}));
            }).catch((err) => {
            reject("Sorry! We cannot find that employee =.=");      
        });
    });
}
module.exports.getManagers=()=>{
    return new Promise((resolve,reject)=>{
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where:{isManager: true}})
            );
        }).catch((err) => {
            reject("Sorry! No results returned =.=");
        });
    });
}
module.exports.getDepartments=()=>{
    return new Promise((resolve,reject)=>{
        sequelize.sync().then(() => {
            resolve(Department.findAll());
        }).catch((err) => {
            reject("Sorry! No results returned =.=");
        });
    });
}

module.exports.addEmployee=(employeeData)=>{
    employeeData.isManager = (employeeData.isManager) ? true : false;
    return new Promise((resolve,reject)=>{
        sequelize.sync().then(() => {
            for (var i in employeeData) {
                if(employeeData[i] == "")
                    employeeData[i] = null;        
            }
            resolve(Employee.create({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                last_name: employeeData.last_name,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addresCity: employeeData.addresCity,
                isManager: employeeData.isManager,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            }));
            }).catch(() => {
            reject("Oops~~~!something went wrong! =.=");
        });
    });
}
module.exports.updateEmployee = (employeeData)=>{
    employeeData.isManager = (employeeData.isManager) ? true : false;
    return new Promise((resolve,reject)=>{
        sequelize.sync().then(() => {
            for (var i in employeeData) {
                if(employeeData[i] == "")
                    employeeData[i] = null;        
            }
            resolve(Employee.update({
                firstName: employeeData.firstName,
                last_name: employeeData.last_name,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addresCity: employeeData.addresCity,
                isManager: employeeData.isManager,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
                }, { 
                    where: {employeeNum: employeeData.employeeNum}
                }));
            }).catch(() => {
            reject("Oops~~~!something went wrong! =.=");
        });
    });
}
module.exports.addDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for (var i in departmentData) {
                if (departmentData[i] == "") 
                    departmentData[i] = null;
            }
            resolve(Department.create({
                departmentId: departmentData.departmentId,
                departmentName: departmentData.departmentName
            }));
            }).catch(() => {
                reject("Oops~~~!something went wrong for Add! =.=");
        });
    });
}

module.exports.updateDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for (var i in departmentData) {
                if (departmentData[i] == "") 
                    departmentData[i] = null;
                }
            resolve(Department.update({ 
                departmentName: departmentData.departmentName,
                }, {
                where: {departmentId: departmentData.departmentId}}));
            }).catch(() => {
                reject("Oops~~~!something went wrong for Update! =.=");
        });
    });
} 

module.exports.getDepartmentById = (id) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Department.findAll({
                where: {departmentId: id}}));
            }).catch(() => {
                reject("Oops~~~! Department ID is not found");
            });
        });
}

module.exports.deleteEmployeeByNum = (empNum) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Employee.destroy({
                where: {employeeNum: empNum }}));
            }).catch(() => {
                reject("Sorry, data cannot be deleted");
        });
    });
}

