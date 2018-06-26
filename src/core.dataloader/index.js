/** @flow
 * @briskhome
 * └core.dataloader <index.js>
 */

import Dataloader from './dataloader';
import type { CoreImports } from '../utilities/coreTypes';

export default (imports: CoreImports) => {
  const db = imports.db;
  const log = imports.log();

  const Device = db.model('core:device');
  const Sensor = db.model('core:sensor');
  const User = db.model('core:user');

  const createDataloaders = () => {
    const batchLoadDevicesById = async (ids: Array<string>) => {
      log.debug({ dataloader: 'deviceById' }, 'batchLoadDeviceById', {
        count: ids.length,
        ids,
      });
      return Promise.all(ids.map(id => Device.findOne({ _id: id }).exec()));
    };
    const batchLoadDevices = async () => {
      log.debug({ dataloader: 'deviceById' }, 'batchLoadDevices');
      return Array.prototype.map.call(await Device.find({}).exec(), device => [
        device._id,
        device,
      ]);
    };

    const batchLoadSensorsById = async (ids: Array<string>) => {
      log.debug({ dataloader: 'sensorById' }, 'batchLoadSensorById', {
        count: ids.length,
        ids,
      });
      return Promise.all(ids.map(id => Sensor.findOne({ _id: id }).exec()));
    };
    const batchLoadSensors = async () => {
      log.debug({ dataloader: 'sensorById' }, 'batchLoadSensors');
      return Array.prototype.map.call(await Sensor.find({}).exec(), sensor => [
        sensor._id,
        sensor,
      ]);
    };

    const batchLoadUsersById = async (ids: Array<string>) => {
      log.debug({ dataloader: 'userById' }, 'batchLoadUsersById', {
        count: ids.length,
        ids,
      });
      return Promise.all(ids.map(id => User.findOne({ _id: id }).exec()));
    };
    const batchLoadUsers = async () => {
      log.debug({ dataloader: 'userById' }, 'batchLoadUsers');
      return Array.prototype.map.call(await User.find({}).exec(), user => [
        user._id,
        user,
      ]);
    };

    const deviceById = new Dataloader(batchLoadDevicesById, batchLoadDevices);
    const sensorById = new Dataloader(batchLoadSensorsById, batchLoadSensors);
    const userById = new Dataloader(batchLoadUsersById, batchLoadUsers);

    return {
      deviceById,
      sensorById,
      userById,
    };
  };

  return createDataloaders;
};
