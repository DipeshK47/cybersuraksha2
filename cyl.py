import sys
sys.path.insert(0, os.path.expandvars("/scratch/$USER/CyberSuraksha/class10_modules/maths/video/topics"))
from manim import *
from _kit import checkerboard, pole3d, tree3d
import os

class Cyl(ThreeDScene):
    def construct(self):
        self.set_camera_orientation(phi=64*DEGREES, theta=-45*DEGREES, zoom=0.9)
        self.add(checkerboard(nx=7, ny=5, cell=1.0))
        # left: current constructor-colour cylinders
        self.add(pole3d(1.4).shift(np.array([-2.0,0,0])))
        self.add(tree3d(3.4).shift(np.array([-0.2,0,0])))
        # right: same but with an explicit set_color()
        p = pole3d(1.4); p.set_color("#c96f3f"); self.add(p.shift(np.array([1.6,0,0])))
        c = Cylinder(radius=.14, height=2.2, direction=OUT, resolution=(2,18))
        c.set_color("#7a4a24"); c.move_to([2.8,0,1.1]); self.add(c)
        self.wait(0.1)
