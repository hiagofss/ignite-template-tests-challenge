import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

describe("CreateUserUseCase", () => {
  let usersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "Sample name",
      email: "test@test.com",
      password: "test@123",
    };

    const userCreated = await createUserUseCase.execute(user);

    expect(userCreated).toHaveProperty("id");
  });

  it("should not be able to create a new user with e-mail alredy exists", async () => {
    const user: ICreateUserDTO = {
      name: "Sample name",
      email: "test@test.com",
      password: "test@123",
    };

    await createUserUseCase.execute(user);

    expect(async () => {
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(AppError);
  });
});
