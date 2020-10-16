const jwt = require('jsonwebtoken');
var db = require('../db')
const bcrypt = require('bcrypt');
const { validateRegisterInput } = require('../validation/register');
const accessTokenSecret = 'spwebTokenJeSuisIndechiffrable';

const login = async (email, password) => {
  try {
    const getUserQueryByEmail = `SELECT * FROM users WHERE email= "${email}"`
    const user =  await new Promise((resolve, reject) => db.query(getUserQueryByEmail,  (err, result, fields) =>  {
      if (err) {
        reject(err)
      } else {
      resolve(result);
    }}))
    if (user.length === 0) {
      return { error: 'utilisateur inexistant' };
    } else if (user) {
      const isValid = await bcrypt.compare(password, user[0].password);
      if (!isValid) {
        return { error: 'mot de passe ou identifiant incorrect' };
      }

      const accessToken = jwt.sign(
        { email: user[0].email, role: user[0].role },
        accessTokenSecret
      );
      return {
        ...user[0],
        token: accessToken
      };
    }
  } catch (e) {
    throw e.message;
  }
};

const register = async (body) => {
  try {
    const { errors, isValid } = await validateRegisterInput(body);
    if (!isValid) {
      return { errors };
    }
    const {firstName ,
      lastName ,
      email ,
      password ,
      billsAddress ,
      phoneNumber ,
       } = body
    const hash = await bcrypt.hash(password, 10);
    let createTableUserQuery = `create table if not exists users(
      id int primary key auto_increment,
      firstName varchar(255)not null,
      lastName varchar(255)not null,
      email varchar(255)not null,
      password varchar(255)not null,
      billsAddress varchar(255)not null,
      phoneNumber varchar(255)not null,
      role varchar(255)not null
  )`;
let insertUserQuery = `INSERT INTO users (firstName, lastName, email, password,billsAddress,phoneNumber,role) VALUES ('${firstName}','${lastName}','${email}','${hash}', '${billsAddress}','${phoneNumber}','user')`;

let getUserQuery = `SELECT * FROM USERS WHERE email="${email}"`
 db.query(createTableUserQuery)
  const users =  await new Promise((resolve, reject) => db.query(getUserQuery,  (err, result, fields) =>  {
    if (err) {
      reject(err)
    } else {
    resolve(result);
  }}))
    if (users.length === 0) {
      db.query(insertUserQuery) 
      return { message: 'Utilisateur enregistré avec succés' };
    } else {
      return { errors: 'utilisateur déjà existant' };
    }
  } catch (error) {
    return error;
  }
};

module.exports = { login, register };
