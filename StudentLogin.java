import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.HashMap;
import java.util.Map;

public class StudentLogin extends JFrame {

    private JTextField usernameField;
    private JPasswordField passwordField;
    private JComboBox<String> roleComboBox;
    private JButton loginButton;
    private JButton resetButton;

    // In-memory demo credentials: username -> password
    private static final Map<String, String> ADMIN_USERS = new HashMap<>();
    private static final Map<String, String> STUDENT_USERS = new HashMap<>();

    static {
        ADMIN_USERS.put("admin", "admin123");
        STUDENT_USERS.put("student", "student123");
    }

    public StudentLogin() {
        setTitle("Student Management System - Login");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(400, 300);
        setLocationRelativeTo(null);
        setResizable(false);

        initComponents();
    }

    private void initComponents() {
        JPanel panel = new JPanel();
        panel.setLayout(new GridBagLayout());
        panel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.insets = new Insets(8, 8, 8, 8);

        // Title
        JLabel titleLabel = new JLabel("Student Management System", SwingConstants.CENTER);
        titleLabel.setFont(new Font("Arial", Font.BOLD, 16));
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        panel.add(titleLabel, gbc);

        // Role Selection
        gbc.gridwidth = 1;
        gbc.gridy = 1;
        gbc.gridx = 0;
        panel.add(new JLabel("Role:"), gbc);

        gbc.gridx = 1;
        String[] roles = {"Student", "Admin"};
        roleComboBox = new JComboBox<>(roles);
        panel.add(roleComboBox, gbc);

        // Username
        gbc.gridy = 2;
        gbc.gridx = 0;
        panel.add(new JLabel("Username:"), gbc);

        gbc.gridx = 1;
        usernameField = new JTextField(15);
        panel.add(usernameField, gbc);

        // Password
        gbc.gridy = 3;
        gbc.gridx = 0;
        panel.add(new JLabel("Password:"), gbc);

        gbc.gridx = 1;
        passwordField = new JPasswordField(15);
        panel.add(passwordField, gbc);

        // Button Panel
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 15, 0));
        loginButton = new JButton("Login");
        resetButton = new JButton("Reset");
        buttonPanel.add(loginButton);
        buttonPanel.add(resetButton);

        gbc.gridy = 4;
        gbc.gridx = 0;
        gbc.gridwidth = 2;
        panel.add(buttonPanel, gbc);

        add(panel);

        // Action Listeners
        loginButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                handleLogin();
            }
        });

        resetButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                usernameField.setText("");
                passwordField.setText("");
                roleComboBox.setSelectedIndex(0);
            }
        });
    }

    private void handleLogin() {
        String username = usernameField.getText().trim();
        String password = new String(passwordField.getPassword());
        String role = (String) roleComboBox.getSelectedItem();

        if (username.isEmpty() || password.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter both username and password.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        boolean authenticated = false;
        if ("Admin".equals(role)) {
            authenticated = password.equals(ADMIN_USERS.get(username));
        } else if ("Student".equals(role)) {
            authenticated = password.equals(STUDENT_USERS.get(username));
        }

        if (authenticated) {
            JOptionPane.showMessageDialog(this, "Login successful as " + role + "! Welcome, " + username + ".", "Success", JOptionPane.INFORMATION_MESSAGE);
            dispose();
            // Open Dashboard window
            openDashboard(username, role);
        } else {
            JOptionPane.showMessageDialog(this, "Invalid username, password, or role.", "Login Failed", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void openDashboard(String username, String role) {
        JFrame dashboard = new JFrame("Dashboard - " + role);
        dashboard.setSize(450, 200);
        dashboard.setLocationRelativeTo(null);
        dashboard.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        JLabel welcomeLabel = new JLabel("Welcome to Student Management System, " + username + " (" + role + ")!", SwingConstants.CENTER);
        welcomeLabel.setFont(new Font("Arial", Font.BOLD, 14));
        panel.add(welcomeLabel, BorderLayout.CENTER);

        dashboard.add(panel);
        dashboard.setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                new StudentLogin().setVisible(true);
            }
        });
    }
}
