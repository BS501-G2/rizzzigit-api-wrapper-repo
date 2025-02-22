import { type ClientEventEmitter } from '../../Wrapper.js'
import type { FileResource } from '../data/file.js'
import { PictureResource } from '../data/picture.js'
import type { MainManager } from '../main.js'
import { BaseManager } from './base.js'

export class PictureManager extends BaseManager<PictureResource, PictureManager> {
  public constructor (main: MainManager, events: ClientEventEmitter) {
    super(main, events, 'Picture')
  }

  public async list (offset?: number, length?: number): Promise<PictureResource[]> {
    const { data } = await this.main.client.api.request(this.generateURL(['p'], {
      offset, length
    }), {
      method: 'GET'
    })

    const pictures: PictureResource[] = []

    for (const entry of data) {
      pictures.push(new PictureResource(this, entry._id, entry))
    }

    return pictures
  }

  public async get (id: string): Promise<PictureResource | null> {
    const cached = this.getCache(id)

    if (cached != null) {
      return cached
    }

    const { data } = await this.main.client.api.request(this.generateURL(['p', id]), {
      method: 'GET'
    })

    return this.setCache(id, new PictureResource(this, data._id, data))
  }

  public async create (file: FileResource): Promise<PictureResource> {
    const { data: { pictureId } } = await this.main.client.api.request(this.generateURL(['p']), {
      method: 'PUT',
      body: {
        fileId: file.id
      }
    })

    return await this.get(pictureId) as PictureResource
  }

  public async delete (picture: PictureResource): Promise<void> {
    await this.main.client.api.request(this.generateURL(['p', picture.id]), {
      method: 'DELETE'
    })
  }
}
