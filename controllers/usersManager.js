const fs = require("fs")
const crypto = require("crypto")

class UserManager {
    constructor(archivo) {
      this.archivo = archivo
    }
    writeFile = async (data) => {
      try {
        await fs.promises.writeFile(
          this.archivo, JSON.stringify(data, null, 2)
        )
      } catch (error) {
        console.log(error)
      }
    }
    getUsers = async () => {
      try {
        
          if (fs.existsSync(this.archivo)) {
            
              const data = await fs.promises.readFile(this.archivo, 'utf-8')
              
              const users = data === "" ? [] : JSON.parse(data)
              return users
          }
          
          console.log('La lista esta vacia')
          return await this.writeFile( [] )
      } catch (error) {
          console.log(error)
      }
    }
    createUser = async (user) => {
      try {
        const users = await this.getUsers()
        users.length === 0 ? user.id = 1 : user.id = users[users.length-1].id + 1
        const validateUserMail = users.find(u => u.email === user.email)
        if(validateUserMail) return console.log('The email you enter is currently in use by another user')
        user.salt = crypto.randomBytes(128).toString('base64')
        user.password = crypto.createHmac('sha256', user.salt).update(user.password).digest('hex')
        users.push(user)
        await this.writeFile(users)
        return user
      } catch (error) {
        console.log(error)
      }
    }
    getUserById = async (id) => {
      try {
        const users = await this.getUsers()
        const user = users.find(u => u.id === id)
        return user ? user : console.log('No user found')
      } catch (error) {
        console.log(error)
      }
    }
    validateUser = async (email, password) => {
      try {
        const users = await this.getUsers()
        const userIndex = users.findIndex(u => u.email === email)
        if(userIndex === -1) return console.log('No user found')
        const user = users[userIndex]
        const compareHash = crypto.createHmac('sha256', user.salt).update(password).digest('hex')
        compareHash === user.password ? console.log('successful login') : console.log('Invalid Password')
      } catch (error) {
        console.log(error)
      }
    }
    deleteUser = async (id) => {
      try {
        const users = await this.getUsers()
        const user = await this.getUserById(id)
        if(!user) return
        const usersFiltred = users.filter(u => u.id !== id)
        await this.writeFile(usersFiltred)
        return console.log('User was successfully removed')
      } catch (error) {
        console.log(error)
      }
    }
}
module.exports = UserManager
