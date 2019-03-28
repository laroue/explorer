import SearchService from '@/services/search'
import store from '@/store'

describe('Search Service', () => {
  beforeAll(() => {
    jest.setTimeout(60000)

    store.dispatch('network/setServer', 'https://explorer.laroue.org/api/v2')
  })

  it('should return address when searching for existing wallet', async () => {
    const data = await SearchService.walletByAddress('ATsPMTAHNsUwKedzNpjTNRfcj1oRGaX5xC')
    expect(Object.keys(data).sort()).toEqual([
      'address',
      'balance',
      'isDelegate',
      'publicKey',
      'secondPublicKey',
      'username',
      'vote'
    ].sort())
  })

  it('should fail when searching for non-existing wallet', async () => {
    await expect(SearchService.walletByAddress('ATsPMTAHNsUwKedzNpjTNRfcj1oRGaX5xz')).rejects.toThrow()
  })

  it('should return delegate address when searching for existing username', async () => {
    const data = await SearchService.delegateByQuery('mlcpool')
    expect(Object.keys(data).sort()).toEqual([
      'username',
      'address',
      'publicKey',
      'votes',
      'rank',
      'blocks',
      'production',
      'forged'
    ].sort())
  })

  it('should fail when searching for non-matching username', async () => {
    await expect(SearchService.delegateByQuery('asdhfajksdhfakjsdfasdf')).rejects.toThrow()
  })

  it('should return delegate address when searching for existing public key', async () => {
    const data = await SearchService.delegateByQuery('02b1d2ea7c265db66087789f571fceb8cc2b2d89e296ad966efb8ed51855f2ae0b')
    expect(Object.keys(data).sort()).toEqual([
      'username',
      'address',
      'publicKey',
      'votes',
      'rank',
      'blocks',
      'production',
      'forged'
    ].sort())
  })

  it('should fail when searching for non-matching public key', async () => {
    await expect(SearchService.delegateByQuery('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')).rejects.toThrow()
  })

  it('should return block when searching for existing block id', async () => {
    const data = await SearchService.blockByQuery('16259489398325158419')
    expect(Object.keys(data).sort()).toEqual([
      'id',
      'version',
      'height',
      'previous',
      'forged',
      'payload',
      'generator',
      'signature',
      'transactions',
      'timestamp'
    ].sort())
  })

  it('should fail when searching for non-existing block id', async () => {
    await expect(SearchService.blockByQuery('0')).rejects.toThrow()
  })

  it('should return transaction when searching for existing transaction id', async () => {
    const data = await SearchService.transactionById('e0a78fa665eb69a5e607a4f3f39a6c9c76a24b647f1cd1d56dd75b29ccf7fa60')
    expect(Object.keys(data).sort()).toEqual([
      'id',
      'blockId',
      'version',
      'type',
      'amount',
      'fee',
      'sender',
      'recipient',
      'signature',
      'confirmations',
      'timestamp'
    ].sort())
  })

  it('should fail when searching for non-existing transaction id', async () => {
    await expect(SearchService.transactionById('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')).rejects.toThrow()
  })
})
