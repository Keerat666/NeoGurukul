//code extra business logic for users here leaving CRUD
const UserModel = require('../models/users')
const LectureModel = require('../models/lecture')

module.exports = {
    user_login(req, res) {
        var body = req.body;


        UserModel.findOne({ email: body.email }, async(err, UserModel1) => {
            if (err) {
                console.log(err);
                res.status(500).json({ "err": err, 'userid': body.uid, "login": false });
            } else {
                console.log(UserModel1);
                if (UserModel1 == null) {
                    res.status(403).json({ "login": false, "err": "No account found with " + body.email });

                } else {
                    //add jwt here 
                    console.log("Entered Password " + req.body.password)
                    console.log("DB Password" + UserModel1.password)

                    if (UserModel1.validPassword(req.body.password)) {

                        if (err) {
                            return res.status(503).json({ "login": false, "err": err });

                        }
                        if (UserModel) {
                            return res.status(200).json({ "_id": UserModel1._id, "login": true , "role" : UserModel1.role });
                        } else {
                            //wrong password
                            return res.status(403).json({ "login": false, "err": " Incorrect Pasword" });

                        }
                    } else {

                        return res.status(403).json({ "login": false, "err": "Incorrect Password" });


                    }




                }

            }
        });
    },


    async home(req, res) {
        try {
          // Count of completed lectures
          const completedCountPromise = LectureModel.countDocuments({ status: 'success' });
    
          // Count of not completed lectures
          const notCompletedCountPromise = LectureModel.countDocuments({ status: { $ne: 'success' } });
    
          // Top 3 recent completed lectures
          const recentCompletedLecturesPromise = LectureModel.find({ status: 'success' })
            .sort({ lecture_created_at: -1 })
            .limit(3)
            .lean();
    
          // Await all in parallel
          const [completedCount, notCompletedCount, recentCompletedLectures] = await Promise.all([
            completedCountPromise,
            notCompletedCountPromise,
            recentCompletedLecturesPromise
          ]);
    
          res.status(200).json({
            completedCount,
            notCompletedCount,
            recentCompletedLectures
          });
        } catch (error) {
          console.error('Error in home controller:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      }
}
