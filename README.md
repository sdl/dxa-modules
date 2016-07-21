dxa-modules
===
SDL Digital Experience Accelerator Modules


About
-----
The SDL Digital Experience Accelerator is a reference implementation of SDL Web 8 and SDL Tridion 2013 SP1 intended to help you create, design and publish an SDL Web/Tridion-based Web site quickly.

You can find more details and a download of the entire release on https://community.sdl.com/developers/tridion_developer/m/mediagallery/852


Support
---------------
The SDL Digital Experience Accelerator is intended as a toolkit to help the SDL Tridion community and is not an officially supported SDL product.

If you encounter problems, reach out to the community: http://tridion.stackexchange.com/


Sources
-------

This repository contains the full source of all the 1.1 DXA modules released by SDL, the modules themselves (packed and ready for installation) will be downloadable from the SDL Community site.


Documentation
-------------

Documentation can be found online in the SDL doc portal, you can find details about this in the download on the SDL Community site.


Repositories
------------

The following repositories with source code are available:

 - https://github.com/sdl/dxa-content-management - Core Template Building Blocks
 - https://github.com/sdl/dxa-html-design - Whitelabel HTML Design
 - https://github.com/sdl/dxa-modules - Modules (.NET and Java)
 - https://github.com/sdl/dxa-web-application-dotnet - ASP.NET MVC web application (incl. framework)
 - https://github.com/sdl/dxa-web-application-java - Java Spring MVC web application (incl. framework)


Branches and Contributions
--------------------------

We are using the following branching strategy:

 - master - Represents the latest stable version. This may be an pre-release version (tagged as "DXA x.y Sprint z"). Updated each development Sprint (approx. bi-weekly).
 - develop - Represents the latest development version. Updated very frequently (typically nightly).
 - release/x.y - Represents the x.y Release. If hotfixes are applicable, they will be applied to the appropriate release branch, so that the release branch actually represent the initial release plus hotfixes.

All releases (including pre-releases) are Tagged. 
 
If you wish to submit a Pull Request, it should normally be submitted on the develop branch, so it can be incorporated in the upcoming release.
Fixes for really severe/urgent issues (which qualify as hotfixes) should be submitted as Pull Request on the appropriate release branch.
Please always submit an Issue for the problem and indicate whether you think it qualifies as a hotfix; Pull Requests on release branches will only be accepted after agreement on the severity of the issue.
Furthermore, Pull Requests on release branches are expected to be extensively tested.

Of course, it's also possible to report an Issue without associated Pull Requests.

Prerequisites (Java)
--------------------
For SDL Tridion 2013 SP1, you need these artifacts (`groudId : artifactId : version`) to be installed into your Maven repository:
 - `com.tridion : cd_ambient : 7.1.0`
 - `com.tridion : cd_broker : 7.1.0`
 - `com.tridion : cd_cache : 7.1.0`
 - `com.tridion : cd_core : 7.1.0`
 - `com.tridion : cd_datalayer : 7.1.0`
 - `com.tridion : cd_deployer : 7.1.0`
 - `com.tridion : cd_dynamic : 7.1.0`
 - `com.tridion : cd_linking : 7.1.0`
 - `com.tridion : cd_model : 7.1.0`
 - `com.tridion : cd_odata : 7.1.0`
 - `com.tridion : cd_odata_types : 7.1.0`
 - `com.tridion : cd_preview_ambient : 7.1.0`
 - `com.tridion : cd_preview_web : 7.1.0`
 - `com.tridion : cd_preview_webservice : 7.1.0`
 - `com.tridion : cd_session : 7.1.0`
 - `com.tridion : cd_tcdl : 7.1.0`
 - `com.tridion : cd_upload : 7.1.0`
 - `com.tridion : cd_wrapper : 7.1.0`
 - `com.tridion : cwd_cartridge : 7.1.2`
 - `com.tridion : cwd_engine : 7.1.2`
 - `com.tridion : cwd_image : 7.1.2`
 - `com.tridion : cwd_resource : 7.1.2`

To use SmartTarget module you also need
 - `com.tridion.smarttarget : session_cartridge : 2014sp1`
 - `com.tridion.smarttarget : smarttarget_cartridge : 2014sp1`
 - `com.tridion.smarttarget : smarttarget_core : 2014sp1`
 - `com.tridion.smarttarget : smarttarget_entitymodel : 2014sp1`
 - `com.tridion.smarttarget : smarttarget_google-analytics : 2014sp1`

To ease the installation you can use the latest [`/install-libs/`](https://github.com/sdl/dxa-web-application-java/tree/develop/install-libs). For help, run `install`.


License
-------
Copyright (c) 2014-2016 SDL Group.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
