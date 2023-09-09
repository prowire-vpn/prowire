import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model, UpdateQuery} from 'mongoose';
import {VpnConfig} from 'server/domain/vpnConfig.entity';

@Schema()
class SubnetSchemaClass {
  @Prop({type: String, required: true})
  public ip!: string;

  @Prop({type: Number, required: true})
  public bits!: number;
}

const SubnetSchema = SchemaFactory.createForClass(SubnetSchemaClass);

@Schema()
export class VpnConfigSchemaClass {
  @Prop({type: SubnetSchema, required: true})
  public subnet!: SubnetSchemaClass;

  @Prop({type: [SubnetSchema]})
  identities!: Array<SubnetSchemaClass>;

  toDomain!: () => VpnConfig;
}

export type VpnConfigDocument = HydratedDocument<VpnConfigSchemaClass>;
export type VpnConfigModel = Model<VpnConfigDocument> & {
  fromDomain: (config: VpnConfig) => UpdateQuery<VpnConfigModel>;
};
export const VpnConfigSchema = SchemaFactory.createForClass(VpnConfigSchemaClass);

VpnConfigSchema.methods.toDomain = function (): VpnConfig {
  return new VpnConfig({
    subnet: this.subnet,
    routes: this.routes,
  });
};

VpnConfigSchema.statics.fromDomain = function (config: VpnConfig): UpdateQuery<VpnConfigModel> {
  return {
    subnet: {ip: config.subnet.ip, bits: config.subnet.bits},
    routes: config.routes.map((route) => ({ip: route.ip, bits: route.bits})),
  };
};
