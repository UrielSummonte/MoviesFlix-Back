class IUserRepository {
    createUser() {
      throw new Error("Método 'createUser()' no implementado");
    }
    findUserById() {
      throw new Error("Método 'findUserById()' no implementado");
    }
    findUserByEmail() {
      throw new Error("Método 'findUserByEmail()' no implementado");
    }
    removeUserById() {
      throw new Error("Método 'removeUserById()' no implementado");
    }
    updateUserById() {
      throw new Error("Método 'updateUserById()' no implementado");
    }
    getAllUsers() {
      throw new Error(
        "Método 'getAllUsers()' no implementado"
      );
    }
    countUsers() {
      throw new Error(
        "Método 'countUsers()' no implementado"
      );
    }  
    countUsersByRol() {
        throw new Error(
          "Método 'countUsersByRol()' no implementado"
        );
      }  
  }
  
  export default IUserRepository;
  