import {Prop, Schema, SchemaFactory, raw} from '@nestjs/mongoose';
import {type HydratedDocument, Model, type UpdateQuery} from 'mongoose';
import {BaseSchema, Mapper} from 'app/infrastructure';
import {VpnClientSession as VpnClientSession} from 'server/domain/clientSession.entity';
import {type IResult as Device} from 'ua-parser-js';

@Schema()
export class VpnClientSessionSchemaClass extends BaseSchema<VpnClientSession> {
  @Prop({type: String, required: true, index: true})
  public userId!: string;

  @Prop(
    raw({
      ua: {type: String},
      browser: {
        name: {type: String, required: false},
        version: {type: String, required: false},
        major: {type: String, required: false},
      },
      device: {
        model: {type: String, required: false},
        vendor: {type: String, required: false},
        type: {type: String, required: false},
      },
      engine: {
        name: {type: String, required: false},
        version: {type: String, required: false},
      },
      os: {
        name: {type: String, required: false},
        version: {type: String, required: false},
      },
      cpu: {
        architecture: {type: String, required: false},
      },
    }),
  )
  public device!: Device;

  @Prop({type: String, required: true})
  public connectingAddress!: string;

  @Prop({type: Date, required: true})
  public createdAt!: Date;

  @Prop({type: Date, required: false})
  public connectedAt?: Date;

  @Prop({type: Date, required: false})
  public addressAssignedAt?: Date;

  @Prop({type: Date, required: false})
  public disconnectedAt?: Date;

  @Prop({type: String, required: false})
  public serverId?: string;

  @Prop({type: String, required: false})
  public assignedAddress?: string;

  @Prop({type: Number, required: false})
  public bytesIn!: number;

  @Prop({type: Number, required: false})
  public bytesOut!: number;
}

export type VpnClientSessionDocument = HydratedDocument<VpnClientSessionSchemaClass>;
export type VpnClientSessionModel = Model<VpnClientSessionDocument> & {
  fromDomain: (session: VpnClientSession) => UpdateQuery<VpnClientSession>;
  fromDomainChanges: (session: VpnClientSession) => UpdateQuery<VpnClientSession>;
};
export const VpnClientSessionSchema = SchemaFactory.createForClass(VpnClientSessionSchemaClass);

const mapper = new Mapper<VpnClientSession, VpnClientSessionSchemaClass>([
  {domainKey: 'id', storageKey: '_id', toDomain: (value) => value?.toString()},
  'userId',
  'device',
  'connectingAddress',
  'createdAt',
  'connectedAt',
  'addressAssignedAt',
  'disconnectedAt',
  'serverId',
  'assignedAddress',
  'bytesIn',
  'bytesOut',
]);

VpnClientSessionSchema.method('toDomain', function (): VpnClientSession {
  return new VpnClientSession(mapper.toDomain(this));
});

VpnClientSessionSchema.static(
  'fromDomain',
  function (session: VpnClientSession): UpdateQuery<VpnClientSessionSchemaClass> {
    return mapper.fromDomain(session);
  },
);

VpnClientSessionSchema.static(
  'fromDomainChanges',
  function (session: VpnClientSession): UpdateQuery<VpnClientSessionSchemaClass> {
    return mapper.fromDomainChanges(session);
  },
);
