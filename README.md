# FLAREclient  UI ***PROTOTYPE*** 

A React/Redux/Material frontend interface for the FLAREclient: A client for TAXII 1.1/2.1 Servers 

## Overview 
This prototype was built extending [ReactCreateApp](https://github.com/facebookincubator/create-react-app). 

*** ADD PROJECT DESCRIPTION HERE (like why this dashboard, high level business logic) ***

## Dev Environment

### Pre-requisites

1. Install [Node.js](https://nodejs.org/en/)


## Docker
The containerization of FLAREclient-UI requires that you have the FLAREclient-Java 
repository locally.
1. Make sure the `FLARECLIENT_JAVA_LOCATION` value is correct in `FLAREclient-UI/build.sh`.
2. Build the docker image `./build-intergrated-image.sh`. This will build the `FLAREclient-Java` `jar` file,
as well as the `FLAREclient-UI` front end.
3. Run the docker image with `./run.sh`.

### Install project dependencies
`$ npm install`
  - this installs the project build tools and dependencies (e.g., webpack, webpack-dev-server, etc.)


### Serve the "development" version of the site locally

`npm run start`
  - This runs Webpack and Webpack Dev Server, which _builds_ and _serves_ the website locally (i.e., it creates a web server on localhost:3000). If you would like to modify the port, read the ReactCreateApp documentation.

### Build the interface for deployment 

`npm run build`
  - This runs Webpack to build and minify the files specified in the build path found in `scripts/build.js`
  
 The contents of the build directory contain everything you need to render the app in the designated web server. For example to deploy 
 to an NGINX web-server copy the contents of the build directory into the `/site/wwwroot` directory 
  
  

## Unit Testing

While no tests were written due to the lack of time and the limitations of a prototype, the base boilerplate provides 
the ability to run the Jest/Enzyme unit tests:
`npm run tests`. 
To produce code coverage reports: `npm run tests -- --coverage` in which will produce coverage reports within the terminal but also produce 
documents within the **coverage** directory. 


## OCP Environment
If your TAXII server is configured for certificate based authentication, you will have to configure
your client to use the keystore associated with you account.

1. If you have access to the FLAREcloud admin ui, associate your cert with your user. The page in
   the admin ui should look like this:
   ![step1](step1.png)
   Once you have associated a user with a certificate, (if the server is configured for certificate
   authentication) all communications received that use your cert will be interpreted as coming
   from your user. **This means if you use your cert with `curl`, `FLAREclient`, or any other means,
   it will be interpreted as coming from your user**.
2. Run your FLAREclient with your cert. For this step, you need a `p12` keystore. We have included
   the script `run-prebuilt.sh` for your convenience. Modify the following line:
   ```aidl
     -v $(pwd)/docker/devKeystore.p12:/opt/app/devKeystore.p12:Z \
   ```
   So that it points to the location of your keystore file. For example, if your keystore is located
   at `/home/someuser/keystore.p12`, then change the line to:
      ```aidl
     -v /home/someuser/keystore.p12:/opt/app/devKeystore.p12:Z \
   ```
   Also make sure to change the values of the following:
   ```aidl
     -e CERT_ALIAS="localhost" \
     -e CERT_KEYSTORE_PASS="12qwaszx@#WESDXC" \
     -e CERT_TRUSTSTORE_PASS="12qwaszx@#WESDXC" \
   ```
   To the correct values for your keystore.

-------

## Legal Disclaimer ##

NOTICE
<ol>
<li>This software package (“software” or “code”) is a work of the United States Government and carries no domestic copyright. Outside of the United States, this work is distributed under the Creative Commons 0 v 1.0 Universal ("CC0") License below. You may use, modify, or redistribute the code in any manner permitted by law. However, you may not subsequently assert copyright in the code as it is distributed. 
<li>Any changes submitted to this project will only be incorporated under the same terms of the CC0 license below. If you elect to contribute to the project, you agree to do so under the terms of the CC0. You are not required to contribute to this project to use, modify, or distribute it.
<li>If you decide to update or redistribute the code, please include this Notice with the code. Where relevant, we ask that you credit the Cybersecurity and Infrastructure Security Agency with the following statement: “Original code developed by the Cybersecurity and Infrastructure Security Agency (CISA), U.S. Department of Homeland Security. Visit cisa.gov for more information.”
<li>USE THIS SOFTWARE AT YOUR OWN RISK. THIS SOFTWARE COMES WITH NO WARRANTY, EITHER EXPRESS OR IMPLIED. THE UNITED STATES GOVERNMENT ASSUMES NO LIABILITY FOR THE USE OR MISUSE OF THIS SOFTWARE OR ITS DERIVATIVES.
<li>THIS SOFTWARE IS OFFERED “AS-IS.” THE UNITED STATES GOVERNMENT WILL NOT INSTALL, REMOVE, OPERATE OR SUPPORT THIS SOFTWARE AT YOUR REQUEST. IF YOU ARE UNSURE OF HOW THIS SOFTWARE WILL INTERACT WITH YOUR SYSTEM, DO NOT USE IT.
</ol>

## CC0 1.0 Universal ##
Official translations of this legal tool are available 

CREATIVE COMMONS CORPORATION IS NOT A LAW FIRM AND DOES NOT PROVIDE LEGAL SERVICES. DISTRIBUTION OF THIS DOCUMENT DOES NOT CREATE AN ATTORNEY-CLIENT RELATIONSHIP. CREATIVE COMMONS PROVIDES THIS INFORMATION ON AN "AS-IS" BASIS. CREATIVE COMMONS MAKES NO WARRANTIES REGARDING THE USE OF THIS DOCUMENT OR THE INFORMATION OR WORKS PROVIDED HEREUNDER, AND DISCLAIMS LIABILITY FOR DAMAGES RESULTING FROM THE USE OF THIS DOCUMENT OR THE INFORMATION OR WORKS PROVIDED HEREUNDER. 

*Statement of Purpose*

The laws of most jurisdictions throughout the world automatically confer exclusive Copyright and Related Rights (defined below) upon the creator and subsequent owner(s) (each and all, an "owner") of an original work of authorship and/or a database (each, a "Work").

Certain owners wish to permanently relinquish those rights to a Work for the purpose of contributing to a commons of creative, cultural and scientific works ("Commons") that the public can reliably and without fear of later claims of infringement build upon, modify, incorporate in other works, reuse and redistribute as freely as possible in any form whatsoever and for any purposes, including without limitation commercial purposes. These owners may contribute to the Commons to promote the ideal of a free culture and the further production of creative, cultural and scientific works, or to gain reputation or greater distribution for their Work in part through the use and efforts of others.

For these and/or other purposes and motivations, and without any expectation of additional consideration or compensation, the person associating CC0 with a Work (the "Affirmer"), to the extent that he or she is an owner of Copyright and Related Rights in the Work, voluntarily elects to apply CC0 to the Work and publicly distribute the Work under its terms, with knowledge of his or her Copyright and Related Rights in the Work and the meaning and intended legal effect of CC0 on those rights.
<ol><li><strong>Copyright and Related Rights.</strong> A Work made available under CC0 may be protected by copyright and related or neighboring rights ("Copyright and Related Rights"). Copyright and Related Rights include, but are not limited to, the following: 
<ol type="i"><li>
i. the right to reproduce, adapt, distribute, perform, display, communicate, and translate a Work;
<li>moral rights retained by the original author(s) and/or performer(s);
publicity and privacy rights pertaining to a person's image or likeness depicted in a Work;
<li>rights protecting against unfair competition in regards to a Work, subject to the limitations in paragraph 4(a), below;
rights protecting the extraction, dissemination, use and reuse of data in a Work;
<li>database rights (such as those arising under Directive 96/9/EC of the European Parliament and of the Council of 11 March 1996 on the legal protection of databases, and under any national implementation thereof, including any amended or successor version of such directive); and
<li>other similar, equivalent or corresponding rights throughout the world based on applicable law or treaty, and any national implementations thereof.
</ol>
<li><strong>Waiver.</strong> To the greatest extent permitted by, but not in contravention of, applicable law, Affirmer hereby overtly, fully, permanently, irrevocably and unconditionally waives, abandons, and surrenders all of Affirmer's Copyright and Related Rights and associated claims and causes of action, whether now known or unknown (including existing as well as future claims and causes of action), in the Work (i) in all territories worldwide, (ii) for the maximum duration provided by applicable law or treaty (including future time extensions), (iii) in any current or future medium and for any number of copies, and (iv) for any purpose whatsoever, including without limitation commercial, advertising or promotional purposes (the "Waiver"). Affirmer makes the Waiver for the benefit of each member of the public at large and to the detriment of Affirmer's heirs and successors, fully intending that such Waiver shall not be subject to revocation, rescission, cancellation, termination, or any other legal or equitable action to disrupt the quiet enjoyment of the Work by the public as contemplated by Affirmer's express Statement of Purpose. 

<li><strong>Public License Fallback.</strong> Should any part of the Waiver for any reason be judged legally invalid or ineffective under applicable law, then the Waiver shall be preserved to the maximum extent permitted taking into account Affirmer's express Statement of Purpose. In addition, to the extent the Waiver is so judged Affirmer hereby grants to each affected person a royalty-free, non transferable, non sublicensable, non exclusive, irrevocable and unconditional license to exercise Affirmer's Copyright and Related Rights in the Work (i) in all territories worldwide, (ii) for the maximum duration provided by applicable law or treaty (including future time extensions), (iii) in any current or future medium and for any number of copies, and (iv) for any purpose whatsoever, including without limitation commercial, advertising or promotional purposes (the "License"). The License shall be deemed effective as of the date CC0 was applied by Affirmer to the Work. Should any part of the License for any reason be judged legally invalid or ineffective under applicable law, such partial invalidity or ineffectiveness shall not invalidate the remainder of the License, and in such case Affirmer hereby affirms that he or she will not (i) exercise any of his or her remaining Copyright and Related Rights in the Work or (ii) assert any associated claims and causes of action with respect to the Work, in either case contrary to Affirmer's express Statement of Purpose.

<li> 
<strong>Limitations and Disclaimers</strong>
<ol type="a">
<li>No trademark or patent rights held by Affirmer are waived, abandoned, surrendered, licensed or otherwise affected by this document.
<li>Affirmer offers the Work as-is and makes no representations or warranties of any kind concerning the Work, express, implied, statutory or otherwise, including without limitation warranties of title, merchantability, fitness for a particular purpose, non infringement, or the absence of latent or other defects, accuracy, or the present or absence of errors, whether or not discoverable, all to the greatest extent permissible under applicable law.
<li>Affirmer disclaims responsibility for clearing rights of other persons that may apply to the Work or any use thereof, including without limitation any person's Copyright and Related Rights in the Work. Further, Affirmer disclaims responsibility for obtaining any necessary consents, permissions or other rights required for any use of the Work.
<li>Affirmer understands and acknowledges that Creative Commons is not a party to this document and has no duty or obligation with respect to this CC0 or use of the Work.
</ol>
</ol>
