package IntFace;

import java.awt.*;

import javax.swing.*;

public class MainFrame extends JFrame{
	int width;
	int height;
	public MainFrame(){
		width=600;
		height=300;
		setTitle("MathMod");
		setSize(width,height);
		setLocationByPlatform(true);
		setLayout(new GridBagLayout());
		
		Label content1 = new Label();
		content1.setText("Индивидуальная работа по математическому программированию:");
		
		//IncFrame content = new IncFrame(,10,20);
		JTextField field1 = new JTextField(10);
		field1.setCaretPosition(-100);
		add(content1);
		add(field1);
	}
	
}