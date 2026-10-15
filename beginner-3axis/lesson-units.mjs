/** Short concept/demo pairs. The demonstrations never modify learner work. */
export const LESSON_UNITS = {
  anatomy: [
    {
      title: {
        en: "The base and first joint",
        zh: "底座与第一个关节",
      },
      concept: {
        en: "The base supports the arm. A joint connects rigid links and lets them rotate. J1 turns the arm around the base; a motor provides the motion. Look for the parts that turn together.",
        zh: "底座支撑机械臂。关节连接刚性连杆，让它们旋转。J1让机械臂绕底座转动，电机提供运动。观察哪些部件一起转动。",
      },
      demo: {
        en: "Watch J1 turn and return. The links above it move together while the supporting base stays on the table.",
        zh: "观察J1转动并返回。上方连杆一起移动，支撑底座仍固定在桌上。",
      },
      kind: "base",
    },
    {
      title: {
        en: "Shoulder, elbow and links",
        zh: "肩关节、肘关节与连杆",
      },
      concept: {
        en: "J2 raises the upper link; J3 bends the elbow. Their angles change the tool position together. More wrist axes would let another robot aim its tool independently. This arm has only three positioning axes.",
        zh: "J2抬起上连杆，J3弯曲肘部。它们的角度共同改变工具位置。更多腕轴可让其他机器人独立控制工具朝向，本机械臂只有三根定位轴。",
      },
      demo: {
        en: "Watch J2 move, then J3. Compare which links move and how the tool tilts. Each returns before the next motion.",
        zh: "先看J2，再看J3。比较哪些连杆移动、工具如何倾斜。每次运动后先返回。",
      },
      kind: "links",
    },
    {
      title: {
        en: "Controller, gripper and feedback",
        zh: "控制器、夹爪与反馈",
      },
      concept: {
        en: "The controller follows commands. The gripper is the end effector and opens or closes separately from the three positioning joints. A command is not proof of success: feedback tells you whether an object is held. Real sensors measure the world; this simulator calculates contact geometrically.",
        zh: "控制器执行指令。夹爪是末端执行器，其开合独立于三个定位关节。指令不等于成功，反馈告诉你是否夹住物体。真实传感器测量环境，本模拟器用几何计算接触。",
      },
      demo: {
        en: "Watch the empty gripper close and open. No positioning joint moves and no object is held. Motor electricity and physical sensor circuits are explanations, not simulated effects.",
        zh: "观察空夹爪闭合再张开。定位关节不动，也没有夹住物体。电机电路和实体传感器只是解释，不是仿真效果。",
      },
      kind: "gripper",
    },
  ],
  coordinates: [
    {
      title: {
        en: "Angles describe joints; XYZ describes the tool",
        zh: "角度描述关节，XYZ描述工具",
      },
      concept: {
        en: "Joint angles use degrees. X, Y and Z locate the tool centre point in millimetres from the base. Changing one angle can change several coordinates. They are two descriptions of the same arm, not interchangeable numbers.",
        zh: "关节角度用度表示，X、Y、Z用毫米表示工具中心点相对底座的位置。一个角度变化可能改变多个坐标。两者描述同一机械臂，但数字不能互换。",
      },
      demo: {
        en: "Watch a small shoulder rotation. Compare the angle readout with the tool position: the tool follows an arc.",
        zh: "观察肩关节小幅旋转。比较角度与工具坐标，工具沿弧线移动。",
      },
      kind: "joint",
    },
    {
      title: {
        en: "Measure an upward move",
        zh: "测量一次向上移动",
      },
      concept: {
        en: "Keep X and Y fixed and add 10 mm to Z. Displacement = final Z − initial Z. For this straight move, distance is the magnitude of displacement. Average speed = distance ÷ simulated time. No trigonometry is needed.",
        zh: "保持X和Y不变，Z增加10毫米。位移＝终点Z－起点Z。此次直线运动的路程是位移的绝对值。平均速度＝路程÷模拟时间，不需要三角函数。",
      },
      demo: {
        en: "Watch Z rise by 10 mm while X and Y stay fixed. J2 and J3 must work together. In your assessment, make your own move and calculate from its measured time.",
        zh: "观察Z上升10毫米而X、Y不变。J2、J3必须协同。评估时自己移动，再用实际测得的模拟时间计算。",
      },
      kind: "full",
    },
  ],
  grip: [
    {
      title: {
        en: "Approach with room for the jaws",
        zh: "留出夹爪空间再接近",
      },
      concept: {
        en: "Open the gripper before approaching. The TCP is the working point between its fingers. Entering coordinates previews a target; Move executes it. Approach from the fixture entrance so the fingers can fit around the part.",
        zh: "接近前张开夹爪。TCP是两指之间的工作点。输入坐标只预览目标，“移动”才执行。从夹具入口接近，让夹指容纳零件。",
      },
      demo: {
        en: "Watch the open gripper approach and reach the pickup point. It does not close yet.",
        zh: "观察张开的夹爪接近并到达抓取点，暂不闭合。",
      },
      kind: "approach",
    },
    {
      title: {
        en: "Confirm the grasp, then lift",
        zh: "确认抓取，再抬起",
      },
      concept: {
        en: "Close at the part, then check Object held. If nothing is held, opening and repositioning is better than continuing blindly. This model checks alignment and contact; it does not simulate grip force, friction or gravity.",
        zh: "在零件处闭合，然后检查“夹持物体”。若未夹住，应张开并调整位置，不要盲目继续。模型检查对齐和接触，不模拟夹持力、摩擦或重力。",
      },
      demo: {
        en: "Watch approach → close → confirmed attachment → lift 10 mm. The object follows only after attachment.",
        zh: "观察接近→闭合→确认夹持→抬高10毫米。确认夹持后，物体才跟随。",
      },
      kind: "full",
    },
  ],
  program: [
    {
      title: {
        en: "A sequence has an order",
        zh: "程序有先后顺序",
      },
      concept: {
        en: "A program is an ordered list of actions. Record ON saves successful moves and gripper changes; OFF lets you explore without adding steps. A transfer needs approach, grip, lift, travel, lower, release and retreat.",
        zh: "程序是有顺序的动作列表。录制开启时保存成功移动及夹爪动作，关闭时可自由探索。搬运需要接近、抓取、抬起、平移、降低、释放和撤离。",
      },
      demo: {
        en: "Watch Reset → Record ON → enter XYZ → Move and gripper actions → Record OFF → Reset → Run. The example controls show each action; your own program stays unchanged.",
        zh: "观察重置→开启录制→输入XYZ→移动和夹爪动作→关闭录制→重置→运行。示范控制显示每个动作，不会修改你的程序。",
      },
      kind: "full",
    },
    {
      title: {
        en: "Test from a repeatable start",
        zh: "从可重复的起点测试",
      },
      concept: {
        en: "After recording, turn Record OFF. Reset returns the robot and part to the starting state and keeps the steps. Run replays them; Pause freezes playback; Stop ends it. Compare the result and improve the sequence before trying again.",
        zh: "录制后关闭录制。重置让机器人与零件回到起点并保留步骤。运行重放，暂停冻结播放，停止结束执行。比较结果、改进程序，再试一次。",
      },
      demo: {
        en: "Watch Record OFF, Reset and Run after the moves are saved. Reset restores the part to Source; Run performs the saved actions again.",
        zh: "观察动作保存后的关闭录制、重置和运行。重置把零件放回起点；运行重新执行已保存动作。",
      },
      kind: "full",
    },
  ],
  obstacle: [
    {
      title: {
        en: "The whole path must fit",
        zh: "整条路径都要避障",
      },
      concept: {
        en: "A reachable end position does not guarantee a clear path. Links, the gripper and the carried part all need clearance. A collision check can reject motion before it starts. The rejection is useful information for revising a route.",
        zh: "终点可达不代表路径无障碍。连杆、夹爪和物体都需要空间。碰撞检查可能在移动前拒绝指令，这有助于修改路线。",
      },
      demo: {
        en: "Watch pickup, then a rejected direct carrying move. No collision impact occurs: the simulator stops the unsafe request before motion.",
        zh: "观察抓取，然后直接搬运被拒绝。不会真的撞击，模拟器在运动前阻止不安全请求。",
      },
      kind: "blocked",
    },
    {
      title: {
        en: "Lift, cross, lower—and test",
        zh: "抬起、跨越、降低，再测试",
      },
      concept: {
        en: "Use intermediate positions to go around the obstacle. Clearance is a geometric constraint; moving slowly does not remove it. Check the arm as well as the object. In the final changed task, choose your own route to destination B.",
        zh: "用中间位置绕开障碍。空间余量是几何约束，慢一点不能消除碰撞。既要检查物体，也要检查机械臂。最终变化任务中，自行选择到目标B的路线。",
      },
      demo: {
        en: "Watch the rejection followed by a revised lift-and-cross route. Compare the direct request with the successful path. This does not prove that every high route is safe.",
        zh: "观察被拒绝的直行和修改后的抬起跨越路线，比较两者。并非所有高处路线都安全。",
      },
      kind: "full",
    },
  ],
  design: [
    {
      title: {
        en: "A robot solves part of a human problem",
        zh: "机器人解决人的部分问题",
      },
      concept: {
        en: "Start with a person and a useful task, not a favourite machine. Choose a body plan that fits the motion. State a benefit, a limitation and what evidence you have. A simulation test supports a proposal; it is not proof of real-world safety or performance.",
        zh: "从人和有用任务出发，而非先选喜欢的机器。选择适合运动的构型，说明好处、限制和证据。仿真测试支持提案，但不能证明现实安全或性能。",
      },
      demo: {
        en: "Worked example: supply small parts to an assembly station. Watch the transfer, then consider repeatability, space and the gripper’s limitations. Use your own test evidence to propose a different application.",
        zh: "示例：向装配工位供给小零件。观察搬运，考虑重复性、空间及夹爪限制。用你的测试证据提出另一种用途。",
      },
      kind: "full",
    },
  ],
};
