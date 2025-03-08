// SPDX-License-Identifier: MIT
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SensorDataStorage {
    struct SensorData {
        uint256 temperature;
        uint256 humidity;
        uint256 timestamp;
    }

    SensorData[] public records;

    event DataStored(uint256 temperature, uint256 humidity, uint256 timestamp);

    function storeSensorData(uint256 _temperature, uint256 _humidity) public {
        records.push(SensorData(_temperature, _humidity, block.timestamp));
        emit DataStored(_temperature, _humidity, block.timestamp);
    }

    function getRecord(uint index) public view returns (uint256, uint256, uint256) {
        require(index < records.length, "Invalid index");
        SensorData storage data = records[index];
        return (data.temperature, data.humidity, data.timestamp);
    }

    function getLatestRecord() public view returns (uint256, uint256, uint256) {
        require(records.length > 0, "No records found");
        SensorData storage data = records[records.length - 1];
        return (data.temperature, data.humidity, data.timestamp);
    }
}
