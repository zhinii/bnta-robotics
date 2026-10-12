const term = (en, zh, meaning, meaningZh) => ({ en, zh, meaning, meaningZh });
export const VOCABULARY = {
  types: [
    term(
      "Robot",
      "机器人",
      "A machine that carries out programmed actions.",
      "按程序执行动作的机器。",
    ),
    term(
      "Body plan",
      "结构类型",
      "How a robot’s moving parts are arranged.",
      "机器人运动部件的组织方式。",
    ),
    term(
      "Articulated arm",
      "关节式机械臂",
      "Connected links that move by rotating at joints.",
      "连杆通过关节旋转而运动的机械臂。",
    ),
    term(
      "Gantry",
      "龙门式机器人",
      "A robot that slides along straight rails.",
      "沿直线导轨滑动的机器人。",
    ),
    term(
      "End effector",
      "末端执行器",
      "The tool that does the job, such as a gripper.",
      "完成工作任务的工具，例如夹爪。",
    ),
    term(
      "Axis",
      "轴",
      "One independently controlled direction of robot motion.",
      "一个能独立控制的机器人运动方向。",
    ),
  ],
  anatomy: [
    term("Base", "底座", "Supports the robot.", "支撑机器人的部分。"),
    term(
      "Joint",
      "关节",
      "A connection that lets parts move relative to each other.",
      "让部件能相对运动的连接处。",
    ),
    term(
      "Link",
      "连杆",
      "A rigid arm segment between joints.",
      "连接关节的刚性臂段。",
    ),
    term(
      "Motor / actuator",
      "电机／执行器",
      "Produces movement from supplied energy.",
      "利用输入能量产生运动。",
    ),
    term(
      "Controller",
      "控制器",
      "Follows the program and sends movement commands.",
      "读取程序并发送运动指令。",
    ),
    term(
      "Gripper",
      "夹爪",
      "An end effector that opens and closes to hold an object.",
      "通过开合抓住物体的末端执行器。",
    ),
  ],
  coordinates: [
    term(
      "Tool centre point (TCP)",
      "工具中心点（TCP）",
      "The point whose position we control.",
      "我们控制位置的工具参考点。",
    ),
    term(
      "Coordinates: X, Y, Z",
      "坐标：X、Y、Z",
      "Three numbers locating a point relative to the robot base; in millimetres here.",
      "相对于机器人底座定位一个点的三个数，本课程单位是毫米。",
    ),
    term(
      "Joint angle",
      "关节角度",
      "A rotation measured in degrees (°), not millimetres.",
      "以度（°）表示的旋转量，不是毫米。",
    ),
    term(
      "Displacement",
      "位移",
      "The change from start position to end position.",
      "从起点到终点的位置变化。",
    ),
    term(
      "Distance",
      "路程",
      "How far the tool travels along its path.",
      "工具沿路径运动的长度。",
    ),
    term(
      "Average speed",
      "平均速度",
      "Distance divided by time; mm/s here.",
      "路程除以时间，本课程用毫米/秒。",
    ),
  ],
  grip: [
    term(
      "Approach",
      "接近",
      "Move toward an object along a suitable direction.",
      "沿合适方向靠近物体。",
    ),
    term(
      "Grasp",
      "抓取",
      "Close the gripper successfully around the object.",
      "夹爪成功闭合并夹住物体。",
    ),
    term(
      "Command",
      "指令",
      "What you ask the robot to do.",
      "你要求机器人执行的动作。",
    ),
    term(
      "Feedback",
      "反馈",
      "Information about what actually happened.",
      "关于实际发生情况的信息。",
    ),
  ],
  program: [
    term(
      "Program",
      "程序",
      "An ordered list of instructions.",
      "按顺序排列的一组指令。",
    ),
    term(
      "Record",
      "录制",
      "Save completed movements and gripper actions as steps.",
      "把已完成的移动和夹爪动作保存为步骤。",
    ),
    term(
      "Replay",
      "回放",
      "Run the saved steps in order.",
      "按顺序运行保存的步骤。",
    ),
    term(
      "Reset",
      "重置",
      "Return to the saved starting scene, keeping the program.",
      "回到保存的起始场景，保留程序。",
    ),
  ],
  obstacle: [
    term(
      "Obstacle",
      "障碍物",
      "Something blocking a possible route.",
      "阻挡可能路径的物体。",
    ),
    term(
      "Clearance",
      "净空",
      "Room for the entire robot and carried object to pass.",
      "让整个机器人和所携物体通过的空间。",
    ),
    term(
      "Waypoint",
      "途经点",
      "An intermediate position used to shape a route.",
      "用来确定路线的中间位置。",
    ),
    term(
      "Test and improve",
      "测试与改进",
      "Observe a result, change the plan, and try again.",
      "观察结果、修改计划并再次尝试。",
    ),
  ],
  design: [
    term(
      "User need",
      "用户需求",
      "A real task or problem that matters to a person.",
      "对某个人有价值的实际任务或问题。",
    ),
    term(
      "Evidence",
      "证据",
      "Recorded observations and test results that support an explanation.",
      "支持解释的观察记录和测试结果。",
    ),
    term(
      "Constraint",
      "限制条件",
      "A boundary that a useful design must work within.",
      "实用设计必须遵守的边界条件。",
    ),
    term(
      "Tradeoff",
      "权衡",
      "An improvement in one area may cost something in another.",
      "一个方面的改善可能需要在另一个方面付出代价。",
    ),
  ],
};
