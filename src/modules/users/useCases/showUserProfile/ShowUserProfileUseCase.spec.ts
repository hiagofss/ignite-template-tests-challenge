import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("ShowUserProfileUseCase", () => {
  let usersRepository: InMemoryUsersRepository;
  let showUserProfileUseCase: ShowUserProfileUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await usersRepository.create({
      name: "Sample name",
      email: "test@test.com",
      password: "test@123",
    });

    const profile = await showUserProfileUseCase.execute(user.id as string);

    expect(profile).toHaveProperty("id");
  });

  it("should not be able to show profile user not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("ABC");
    }).rejects.toBeInstanceOf(AppError);
  });
});
