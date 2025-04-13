Given required end location and rotation on final hand/claw/other, determine required rotation/translation/everything of each body part (can have multiple right answers)

### In 2D
Given the desired end-effector coordinates x and y and desired angle θ, we find [[Homogenous Transform]] of each joint to get there

From [[Forward Kinematics]] we know that the final H = H<sub>1</sub> * H<sub>2</sub> * … * H<sub>n</sub> for n joints

in final H’s equation we insert joint lengths to calculate x and y and then solve for angles for instance if we just want it by rotation only (mostly the case unless one of the joints allows shortening/lengthening)

generally we know that the final angle is sum of all rotation angles in transforms and by final x and y we will write out the linear equations and all legal solutions are good