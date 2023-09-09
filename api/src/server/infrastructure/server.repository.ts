import {Injectable} from '@nestjs/common';
import {ServerModel, ServerSchemaClass} from './server.schema';
import {InjectModel} from '@nestjs/mongoose';
import {Server} from 'server/domain/server.entity';

@Injectable()
export class ServerRepository {
  constructor(@InjectModel(ServerSchemaClass.name) private serverModel: ServerModel) {}

  async persist(server: Server): Promise<Server> {
    await this.serverModel.findOneAndUpdate(
      {name: server.name},
      this.serverModel.fromDomain(server),
      {
        new: true,
        upsert: true,
      },
    );
    return server;
  }

  async get(name: string): Promise<Server | null> {
    const server = await this.serverModel.findOne({name});
    return server && server.toDomain();
  }

  async find(): Promise<Server[]> {
    const servers = await this.serverModel.find();
    return servers.map((server) => server.toDomain());
  }
}
