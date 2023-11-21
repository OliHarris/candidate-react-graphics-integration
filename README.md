# Graphics Inregration

This was originally a test set for BBC, which I have since dropped into a fresh instance of Vite to continue building out.

:heavy_check_mark: Code in pure React / TypeScript

:heavy_check_mark: No jQuery

## Original specs

More can be built out here as per the original specs of the test listed below:

### The Timeline Management

For this task, we want you to build a timeline out of events. These timeline ‘events’ represent actions that will trigger web motion in a web app you’ll build at a later step. We are calling the succession of events a timeline.

- Given the file located here: 
https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_ 10s_10MB.mp4, create a web page containing a video web player playing the file mentioned above.
- Given the list of events here below, create an object representation of the array

| ID          | startTime (HH:MM:SS:FF) | endTime (HH:MM:SS:FF) | captionType | captionData                        |
| ----------- | ----------------------- | --------------------- | ----------- | ---------------------------------- |
| 0           | 00:00:01:00             | 00:00:10:00           | Logo        | action: on / location: top left    |
| 1           | 00:00:02:00             | 00:00:03:20           | nameSuper   | line1: a rabbit hole               |
| 2           | 00:00:04:00             | 00:00:05:10           | nameSuper   | line1: a tree / line2: (a big one) |
Optional from here
| 3           | 00:00:06:00             | 00:00:06:20           | nameSuper   | line1: some rocks                  |
| 4           | 00:00:07:00             | 00:00:08:14           | nameSuper   | line1: some grass                  |
| 5           | 00:00:09:00             | 00:00:10:00           | title       | text: the end                      |

- Link both the timeline and the video player. 
Upon starting, the video player will pause when its timecode reaches one of the **startTime** listed in the timeline object created at the above step. The player should resume playing at the click of the play button.

### Web Animation

For this task, you will create a web app with the modern javascript framework of your choice. This app will recreate the three graphical elements illustrated by the pictures here below. Note that the positioning of the element should be respected given the aspect ratio.

- nameSuper
Bottom-left; line 1 and 2 on top of each other
- logo
Here you will display the BBC logo. It can be found here: 
https://static.files.bbci.co.uk/orbit/8161b75793cc3c38d814e1a4a19a2f6a/img/blq-orbi t-blocks_grey.svg
- title
Middle-left; bigger text
-  The three elements will have the functionality of being turned (displayed) on or off programmatically.
- The blue background in the pictures above must be interpreted as transparent.
- The **title** and **nameSuper** element will take respectively one and two strings as parameters.

### The Triggers

-  Given the two first tasks and knowing that the **names of the elements** in the second task are the **captionType** of the timeline in the first task, animate the elements on ‘top’ of the video player created in the first task.
-  __Expected result__: Upon playing the video, the different elements will be displayed / animated on top of said video according to their startingTime and en in the timeline defined above.

### Non-functional Requirements

- Timeline is easily extendable with other elements / events

## Available Scripts

In the root directory you can run:

### `npm install`

Will perform a usual installation of any dependencies.

### `npm run dev`

Will perform a usual launch of the dev environment.

## NOTE:

As this is a Vite app, I hosted it on GitHub pages using this guide:

https://medium.com/@aishwaryaparab1/deploying-vite-deploying-vite-app-to-github-pages-166fff40ffd3
