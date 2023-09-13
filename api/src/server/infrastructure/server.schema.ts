import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model, UpdateQuery} from 'mongoose';
import {Server} from 'server/domain/server.entity';

@Schema({_id: false})
export class ServerSchemaClass {
  @Prop({type: String, required: true, unique: true, index: true})
  public name!: string;

  @Prop({type: Boolean, required: true, default: false})
  public connected!: boolean;

  @Prop({type: Date, required: false})
  public connectedAt?: Date;

  @Prop({type: Date, required: false})
  public lastSeenAt?: Date;

  @Prop({type: Boolean, required: true, default: false})
  public active!: boolean;

  @Prop({type: String, required: true})
  public ip!: string;

  @Prop({type: Number, required: true})
  public port!: number;

  @Prop({type: String, required: true})
  public publicKey!: number;

  toDomain!: () => Server;
}

export type ServerDocument = HydratedDocument<ServerSchemaClass>;
export type ServerModel = Model<ServerDocument> & {
  fromDomain: (server: Server) => UpdateQuery<Server>;
};
export const ServerSchema = SchemaFactory.createForClass(ServerSchemaClass);

ServerSchema.methods.toDomain = function (): Server {
  return new Server({
    name: this.name,
    connected: this.connected,
    connectedAt: this.connectedAt,
    lastSeenAt: this.lastSeenAt,
    active: this.active,
    ip: this.ip,
    port: this.port,
    publicKey: this.publicKey,
  });
};

ServerSchema.statics.fromDomain = function (server: Server): UpdateQuery<Server> {
  return {
    name: server.name,
    connected: server.connected,
    connectedAt: server.connectedAt,
    lastSeenAt: server.lastSeenAt,
    active: server.active,
    ip: server.ip,
    port: server.port,
    publicKey: server.publicKey,
  };
};
