
class Shedule {
  public getAll (): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve('Hello Word')
      // reject(Error('Hello Error'))
    })
  }
}

export default new Shedule()
