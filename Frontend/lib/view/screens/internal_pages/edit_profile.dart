import 'package:flutter/material.dart';
import 'package:frondend/common/assigns.dart';
import 'package:frondend/common/style.dart';
import 'package:frondend/view/components/widgets/common_appbar.dart';
import 'package:frondend/view/components/widgets/profile_field.dart';
import 'package:google_fonts/google_fonts.dart';

class EditProfileScreen extends StatelessWidget {
  const EditProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;
    return Scaffold(
      appBar: CommonAppBarWidget(
        text: Assigns.editProfile,
      ),
      body: Container(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 30),
            Center(
              child: Container(
                height: screenHeight * 0.18,
                width: screenWidth * 0.4,
                decoration: BoxDecoration(
                  border: Border.all(),
                  borderRadius: BorderRadius.circular(8),
                  image: DecorationImage(
                    image: AssetImage(Assigns.personImage),
                    fit: BoxFit.contain,
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Container(
                        height: 20,
                        width: 20,
                        decoration: BoxDecoration(
                            color: Colors.black,
                            borderRadius: BorderRadius.circular(5)),
                        child: Center(
                            child: Icon(
                          Icons.edit_square,
                          size: 14,
                          color: Colors.white,
                        )),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 60),
            Padding(
              padding: const EdgeInsets.all(10.0),
              child: Container(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Full Name:'),
                    SizedBox(height: 6),
                    Container(
                      height: 50,
                      width: double.infinity,
                      decoration: BoxDecoration(
                          color: Style.myColor,
                          border: Border.all(),
                          borderRadius: BorderRadius.circular(5)),
                      child: Padding(
                        padding: EdgeInsets.all(8.0),
                        child: TextField(
                          decoration: InputDecoration(
                              border: InputBorder.none,
                              labelText: 'Type here',
                              labelStyle: GoogleFonts.mulish(fontSize: 12)),
                        ),
                      ),
                    ),
                    SizedBox(height: 6),
                    Text('Mobile Number:'),
                    SizedBox(height: 6),
                    ProfileFieldWidget(
                      onTap: () {},
                    ),
                    SizedBox(height: 6),
                    Text('Email ID:'),
                    ProfileFieldWidget(
                      onTap: () {},
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  height: 45,
                  width: 160,
                  decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(10)),
                  child: Center(
                    child: Text(
                      'SUBMIT',
                      style: GoogleFonts.mulish(
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                    height: 45,
                    width: 160,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(width: 1.5),
                    ),
                    child: Center(
                      child: Text(
                        'Delete Account',
                        style: GoogleFonts.mulish(fontWeight: FontWeight.bold),
                      ),
                    )),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
