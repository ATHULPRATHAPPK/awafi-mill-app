import 'package:flutter/material.dart';
import 'package:frondend/common/assigns.dart';
import 'package:frondend/common/style.dart';
import 'package:frondend/view/components/widgets/auth_button.dart';
import 'package:frondend/view/components/widgets/back_arrow.dart';
import 'package:frondend/view/components/widgets/drop_down_field.dart';
import 'package:frondend/view/components/widgets/text_field.dart';
import 'package:frondend/view/screens/onboarding_pages/verification_screen.dart';
import 'package:frondend/view_model/services.dart/model.dart/user_credential.dart';
import 'package:frondend/view_model/services.dart/repos/user_credential.dart';
import 'package:get/get.dart';

class SignUpScreen extends StatelessWidget {
  const SignUpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final TextEditingController nameController = TextEditingController();
    final TextEditingController phoneNumberController = TextEditingController();
    final TextEditingController emailController = TextEditingController();
    final TextEditingController passwordController = TextEditingController();
    final AuthService authService = AuthService();

    Future<void> registerUser() async {
      UserData user = UserData(
        name: nameController.text,
        phoneNumber: phoneNumberController.text,
        email: emailController.text,
        password: passwordController.text,
      );

      final success = await authService.registerUser(user);
      if (success) {
        Get.snackbar('Success', 'Credential added successfully',
            backgroundColor: Colors.blue);
        Get.to(() => VerificationScreen());
      } else {
        Get.snackbar('Error', 'Failed to register user. Please try again.',
            backgroundColor: Colors.red);
      }
    }

    return SafeArea(
      child: GestureDetector(
        onTap: () {
          FocusScope.of(context).unfocus();
        },
        child: Scaffold(
          body: Container(
            child: Column(
              children: [
                Expanded(
                  flex: 1,
                  child: Container(
                    width: double.infinity,
                    height: double.infinity,
                    child: Column(
                      children: [
                        BackArrowButtonWidget(),
                        Expanded(
                          child: Column(
                            children: [
                              Flexible(
                                child: Image.asset(
                                  Assigns.logoImage,
                                  height: 100,
                                  width: 100,
                                ),
                              ),
                              SizedBox(height: 20),
                              Flexible(
                                child: Image.asset(
                                  Assigns.appName,
                                ),
                              ),
                              SizedBox(height: 6),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Expanded(
                  flex: 2,
                  child: Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(20),
                        topRight: Radius.circular(20),
                      ),
                      color: Colors.black,
                    ),
                    child: SingleChildScrollView(
                      child: Padding(
                        padding: EdgeInsets.only(left: 22, right: 22, top: 36),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Sign Up',
                              style: Style.textStyle,
                            ),
                            SizedBox(height: 20),
                            CustomizableTextFieldwidget(
                              controller: nameController,
                              labelText: Assigns.name,
                            ),
                            SizedBox(height: 16),
                            CountryCodeTextField(
                                controller: phoneNumberController,
                                labelText: Assigns.numberText),
                            CustomizableTextFieldwidget(
                              controller: emailController,
                              labelText: Assigns.email,
                            ),
                            SizedBox(height: 16),
                            CustomizableTextFieldwidget(
                              controller: passwordController,
                              labelText: Assigns.passwordLabelText,
                            ),
                            SizedBox(height: 20),
                            AuthenticateSaveButton(
                              buttonText: Assigns.signUp,
                              onpressed: () {
                                if (nameController.text.isNotEmpty &&
                                    phoneNumberController.text.isNotEmpty &&
                                    emailController.text.isNotEmpty &&
                                    passwordController.text.isNotEmpty) {
                                  registerUser();
                                } else {
                                  Get.snackbar(
                                      'Error', 'All fields are required');
                                }
                              },
                            ),
                            SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  Assigns.alreadyHave,
                                  style: TextStyle(
                                    color: Colors.white,
                                  ),
                                ),
                                TextButton(
                                  onPressed: () {
                                    Get.back();
                                  },
                                  child: Text(
                                    Assigns.login,
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Flexible(
                                  child: RichText(
                                    textAlign: TextAlign.center,
                                    text: TextSpan(
                                      children: [
                                        TextSpan(
                                          text: Assigns.termsMessage,
                                          style: TextStyle(
                                            color: Colors.white70,
                                          ),
                                        ),
                                        TextSpan(
                                          text: 'Terms of Service, ',
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                            decoration:
                                                TextDecoration.underline,
                                          ),
                                        ),
                                        TextSpan(
                                          text: 'Privacy Policy',
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                            decoration:
                                                TextDecoration.underline,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
