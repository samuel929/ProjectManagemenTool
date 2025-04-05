jest.mock('redis', () => ({
    createClient: () => ({
      connect: jest.fn(),
      on: jest.fn(),
      subscribe: jest.fn((channel, cb) => cb(JSON.stringify({
        type: 'task-assigned',
        userId: '123',
        message: 'You have a new task'
      })))
    })
  }));
  
  test('mock redis pub/sub', async () => {
    const logSpy = jest.spyOn(console, 'log');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('📣 Notify User'));
  });
  