class IUserRepository {
    createUser() {
      throw new Error("Método 'createUserRepository()' no implementado");
    }
    findUserById() {
      throw new Error("Método 'findUserByIdRepository()' no implementado");
    }
    findUserByEmail() {
      throw new Error("Método 'findUserByEmailRepository()' no implementado");
    }
    removeUserById() {
      throw new Error("Método 'removeUserById()' no implementado");
    }
    updateUserById() {
      throw new Error("Método 'updateUserByIdRepository()' no implementado");
    }
    // addProfileUser() {
    //   throw new Error("Método 'addProfileUserRepository()' no implementado");
    // }
    // removeProfileUser() {
    //   throw new Error("Método 'removeProfileUserRepository()' no implementado");
    // }
    getAllUsers() {
      throw new Error(
        "Método 'GetAllUsersRepository()' no implementado"
      );
    }
    countUsers() {
      throw new Error(
        "Método 'CountUsersRepository()' no implementado"
      );
    }  
    countUsersByRol() {
        throw new Error(
          "Método 'findMoviesByTextRepository()' no implementado"
        );
      }  
  }
  
  export default IUserRepository;
  