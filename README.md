# UpresPPro12
Premiere extension to upres a project (good for version 12)

This extension will:
1. Upres each clip in the active sequence
2. Upres any nested sequences included in the active sequence.
3. Tell the user which sequence settings to adjust manually.

To run the extension:
1. Save the entire folder (UpresPPro12) under /Library/Application Support/Adobe/CEP/extensions. 
2. Open your terminal and run this command: defaults write com.adobe.CSXS.5 LogLevel 5
3. To run the script, open Premiere and go to Window > Extensions and select "Upres" from the menu. 
(Note: It will only appear in the menu if you save it to the location specified in Step 1.)
