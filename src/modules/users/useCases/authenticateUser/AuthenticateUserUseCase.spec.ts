import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

describe("AuthenticateUserUseCase", () => {
  let usersRepository: InMemoryUsersRepository;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to authenticate user", async () => {
    const userData: ICreateUserDTO = {
      name: "Sample name",
      email: "test@test.com",
      password: "test@123",
    };

    await createUserUseCase.execute(userData);

    const { user, token } = await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password,
    });

    expect(user).toHaveProperty("id");
    expect(token).not.toBeNull();
  });
  it("should not be able to authenticate an no-existing user", async () => {
    const userData = {
      name: "Test Name",
      email: "Test Email",
      password: "Test Password",
    };

    await expect(
      authenticateUserUseCase.execute({
        email: userData.email,
        password: userData.password,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate a user with wrong password", async () => {
    const userData = {
      name: "Test Name",
      email: "Test Email",
      password: "Test Password",
    };

    await createUserUseCase.execute(userData);

    await expect(
      authenticateUserUseCase.execute({
        email: userData.email,
        password: "wrong password",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
