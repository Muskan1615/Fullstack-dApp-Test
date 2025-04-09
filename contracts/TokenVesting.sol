// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenVesting is Ownable {
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 start;
        uint256 duration;
        uint256 claimed;
    }

    IERC20 public token;
    mapping(address => VestingSchedule) public schedules;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function addVesting(address beneficiary, uint256 amount, uint256 start, uint256 duration) external onlyOwner {
        require(schedules[beneficiary].totalAmount == 0, "Vesting exists");
        schedules[beneficiary] = VestingSchedule(amount, start, duration, 0);
    }

    function claim() external {
        VestingSchedule storage schedule = schedules[msg.sender];
        require(schedule.totalAmount > 0, "No schedule");

        uint256 elapsed = block.timestamp > schedule.start ? block.timestamp - schedule.start : 0;
        if (elapsed > schedule.duration) elapsed = schedule.duration;

        uint256 vested = (schedule.totalAmount * elapsed) / schedule.duration;
        uint256 claimable = vested - schedule.claimed;

        require(claimable > 0, "Nothing to claim");

        schedule.claimed += claimable;
        require(token.transfer(msg.sender, claimable), "Transfer failed");
    }
}
