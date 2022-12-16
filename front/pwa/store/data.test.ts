import { RootState } from './store'
import {
  IDataState,
  dataReducer,
  selectApi,
  selectBundles,
  setData,
} from './data'

const initialState: IDataState = {
  api: null,
  bundles: null,
  configurations: null,
}

describe('dataReducer', () => {
  it('should return the initial state', () => {
    expect(dataReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  it('should set the data', () => {
    expect(
      dataReducer(
        initialState,
        setData({ api: 'foo', bundles: 'bar' } as unknown as IDataState)
      )
    ).toEqual(
      expect.objectContaining({
        api: 'foo',
        bundles: 'bar',
      })
    )
  })

  it('Should select the requested path', () => {
    const rootState = {
      data: {
        api: 'foo',
      },
    } as unknown as RootState
    expect(selectApi(rootState)).toEqual('foo')
  })

  it('Should select the token', () => {
    const rootState = {
      data: {
        bundles: 'bar',
      },
    } as unknown as RootState
    expect(selectBundles(rootState)).toEqual('bar')
  })
})
