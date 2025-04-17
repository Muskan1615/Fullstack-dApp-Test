// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TokenVesting is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public token;

    mapping(address => VestingSchedule) public schedules;

    struct VestingSchedule {
        uint256 totalAmount;
        uint256 claimed;
        uint256 start;
        uint256 duration;
    }

    event VestingAdded(
        address indexed beneficiary,
        uint256 amount,
        uint256 start,
        uint256 duration
    );
    event TokensClaimed(address indexed beneficiary, uint256 amount);

    constructor(IERC20 _token) Ownable(msg.sender) {
        token = _token;
    }

    function addVesting(
        address beneficiary,
        uint256 amount,
        uint256 start,
        uint256 duration
    ) external onlyOwner {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(
            schedules[beneficiary].totalAmount == 0,
            "Vesting already exists"
        );
        require(start >= block.timestamp, "Start in past");
        require(amount > 0, "Amount must be greater than 0");
        require(duration > 0, "Invalid duration");

        schedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            claimed: 0,
            start: start,
            duration: duration
        });

        emit VestingAdded(beneficiary, amount, start, duration);
    }

    function claim() external {
        VestingSchedule storage schedule = schedules[msg.sender];

        require(schedule.totalAmount > 0, "No vesting schedule");
        uint256 claimableAmount = _calculateClaimable(schedule);

        require(claimableAmount > 0, "No claimable tokens");

        schedule.claimed += claimableAmount;
        token.safeTransfer(msg.sender, claimableAmount);

        emit TokensClaimed(msg.sender, claimableAmount);
    }

    function _calculateClaimable(
        VestingSchedule storage schedule
    ) internal view returns (uint256) {
        if (block.timestamp < schedule.start) {
            return 0;
        }

        uint256 elapsed = block.timestamp - schedule.start;
        uint256 vestedAmount = (schedule.totalAmount * elapsed) /
            schedule.duration;

        if (vestedAmount > schedule.totalAmount) {
            vestedAmount = schedule.totalAmount;
        }
        uint256 claimableAmount = vestedAmount - schedule.claimed;

        return claimableAmount;
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        token.safeTransfer(owner(), amount);
    }
}
