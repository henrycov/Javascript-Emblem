
# Javascript-Emblem

Final Project for CMSC335. Fire Emblem battle simulator allowing users to create and battle custom units. Based off of old personal project.

  

---

  

**Team Members** - Solo Project by Henry Covington (116017268)

  

**API Links** - [Google Oauth](https://developers.google.com/identity/protocols/oauth2), implemented using [Passport](https://www.passportjs.org/)

  

Deployed live at: https://javascript-emblem.herokuapp.com/

  

Significant References:

- The Great Nelson's CMSC355 Class

-  [This Wonderful Passport Tutorial](https://www.youtube.com/watch?v=Q0a0594tOrc&t=972s&ab_channel=KrisFoster)

-  [This CodePen Button Google Button Replica](https://codepen.io/stefanjs98/pen/ambVgK)

-  [Coolor.co](https://coolors.co/palette/132a13-31572c-4f772d-90a955-ecf39e) and [Material.io](https://material.io/design/color/the-color-system.html) for color palette references.

  

---

  

## How to use:

  

Short Demonstration Video: https://www.youtube.com/watch?v=RkZXbb1Qrv4&ab_channel=LampShady

  

### Simulate a Battle:

1. Go to the battle page at /battle

2. Go to the dropdown menu for the blue unit, select a unit and press the "Select Blue Unit" button
This make a call to the database to get the stats for the selected unit.

3. Repeat for the red unit

4. Press the start button, this will make a call to the backend to take the two unit's stats and calculate the necessary battle variables. Formulas can be found [here](##formulas)

5. Pressing the step button will continue to progress the simulation until one of the unit runs out of hit points granting the other victory.

6. Hitting start again will reset the simulation. You may edit the unit fields to change the simulation, but changes to the data base can only be done through the unit creator

### Create a Custom Unit:
1.  Login using the /login page

2.  Go to the unit creator page at /creator

3. Fill out the fields. Class, unit type, skills, weapon name, weapon type, effective against are optional. You can select a unit from the top and hit the "fill" button to fill the fields out using the unit's data as a refence. 

4. Hit the "build unit" button with the selection box set to "Create New Unit. **Do not forget to change the selection box back to Create New Unit if you plan to use another unit as a reference**. Forgetting to do so will update the selected unit.

### Update a Unit:
1.  Login using the /login page

2.  Go to the unit creator page at /creator

3. Select the unit in the drop down box and hit the "fill" button.

4. Change the desired fields and hit the "build unit" button.

### Delete a Unit:
1.  Login using the /login page

2.  Go to the unit creator page at /creator

3. Select the unit in the drop down box and hit the red "delete" button.

## Formulas
Based on [Serenes Forest](https://serenesforest.net/awakening/miscellaneous/calculations/) description of Awakening Formulas

Similar to Awakening, the simulation does not use true probability. It uses double roll or 2RN which averages the result of two roles. [More info here.](https://serenesforest.net/general/true-hit/)

**Damage:**
>unit strength or magic + weapon might (x3 if effective) (x3 if crit)

Strength is used for physical weapons, magic is used for magical weapons.

A weapon is  effective if a weapon effectiveness matches one of the foes unit types.

**Hit Rate:**
> (weapon’s hit rate + [(unit skill x 3 + unit Luck) / 2] + weapon triangle bonus) - (enemy speed * 3 + enemy luck)*

Weapon triangle bonus is +10 if weapon has advantage, -10 if weapon has disadvantage.

sword < lance < axe < sword

**Critical Rate:**
> weapon’s Critical + (unit skill / 2)*

### Current Inaccuracies
- Classes are currently purely a descriptor. No bonuses or weapon restrictions.
- Follow-Up Attacks and Skills are yet to be implemented
- Triangle bonus varies on weapon rank, currently weapon rank is assumed to be C