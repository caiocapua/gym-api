import { expect, describe, it } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Service', () => {
  it('should be able to register', async () => {
    const inMemoryRepository = new InMemoryRepository()
    const registerService = new RegisterService(inMemoryRepository)

    const { user } = await registerService.execute({
      name: 'Caio',
      email: 'caiocapua@hotmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const inMemoryRepository = new InMemoryRepository()
    const registerService = new RegisterService(inMemoryRepository)

    const { user } = await registerService.execute({
      name: 'Caio',
      email: 'caiocapua@hotmail.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const inMemoryRepository = new InMemoryRepository()
    const registerService = new RegisterService(inMemoryRepository)

    // const email = 'caiocapua@hotmail.com'

    await registerService.execute({
      name: 'Caio',
      email: 'caiocapua@hotmail.com',
      password: '123456',
    })

    await expect(() =>
      registerService.execute({
        name: 'John Doe',
        email: 'caiocapua@hotmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
