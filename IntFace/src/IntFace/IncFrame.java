package IntFace;

import java.awt.*;
import javax.swing.*;

public class IncFrame extends JPanel {
	String msg;
	int left;
	int right;
	
	public IncFrame(String m, int l, int r){
		msg=m;
		left=l;
		right=r;
	}
	
	public void paintComponent(Graphics g){
		g.drawString(msg, left, right);
	}
	
}
