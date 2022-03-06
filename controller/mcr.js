const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/error')
const {
    user_game,
    user_game_history,
    user_game_biodata,
    room
} = require('../models')


const RegisterAPI = async (req, res, next) => {
    try {
        if(req.body.password1 != req.body.password2){
            return errorHandler(400, "Password yang anda masukkan tidak cocok", res)
        }else{
            const hashedPassword = await bcrypt.hash(req.body.password1, 10)
            const newUser = await user_game.create({
                username: req.body.username,
                email: req.body.email,
                role: req.body.role,
                password: hashedPassword
            })

            await user_game_history.create({
                user_game_uuid :newUser.uuid
            })

            await user_game_biodata.create({
                full_name: req.body.full_name,
                user_game_uuid: newUser.uuid
            })

            res.json({
                message: "User Created Successfully"
            })
        }
        
    } catch (error) {
        console.log(error)
        return errorHandler(500, error.message, res)      
    }
}

const LoginAPI = async (req, res, next) => {
    try {
        if(!req.body.email){
            return errorHandler(400, "Please Insert Email", res)  
        }
        const user = await user_game.findOne({
            where: {
                email: req.body.email.toLowerCase()
            }
        })

        if(!user){
            return errorHandler(404, "Email Not Found", res)    
        }

        let validPassword = bcrypt.compareSync(req.body.password, user.password)

        if(!validPassword){
            return errorHandler(400, "Incorrect Password", res)  
        }else {
            let token = jwt.sign({
                user_id : user.uuid,
                role: user.role,
                username: user.username
            }, 
            process.env.JWT_SECRET,
            {
                expiresIn: 1000*60*60*24
            }
            )
            res.status(200).json({
                message: `You're Logged in as ${user.username}`,
                role: user.role,
                token: token
            })
        }       
    } catch (error) {
        console.log(error)
        return errorHandler(500, error.message, res)      
    }
}

const CreateRoom = async (req, res, next) =>{
    try {
        const roomName = req.body.room_name
        const user = req.user

        if(!roomName){
            return errorHandler(400, 'Please Input Room Name', res)
        }

        const newRoom = await room.create({
            room_name: roomName,
            owned_by: user.user_id
        })

        res.status(201).json({
            status: "SUCCESS",
            message: "New Room Created",
            room_name: newRoom.room_name
        })
    } catch (error) {
        console.log(error)
        return errorHandler(500, error.message, res)  
    }
}

const PlayGameRoom = async (req, res, next) => {
    try {
        const playerChoices = req.body.choices
        const roomName = req.body.room_name

        if(!playerChoices){
            return errorHandler(400, "Plaese Input Your Choice", res)  
        }
        if(!Array.isArray(playerChoices)){
            return errorHandler(400, "Please Input Your Choice In Array", res) 
        }
        if(playerChoices.length != 3){
            return errorHandler(400, "Please Input 3 Choice", res) 
        }
        if(!roomName){
            return errorHandler(400, "Please Input Room Nanme", res) 
        }

        const foundRoom = await room.findOne({
            where: {
                room_name : roomName.toLowerCase()
            }
        })

        if(!foundRoom){
            return errorHandler(404, "Room Not Found", res) 
        }else{
            if(!foundRoom.player1_uuid){
                await foundRoom.update({
                    player1_choices : playerChoices,
                    player1_uuid: req.user.user_id
                })
            }else if(!foundRoom.player2_uuid){
                await foundRoom.update({
                    player2_choices : playerChoices,
                    player2_uuid: req.user.user_id
                })
            }else {
                return errorHandler(400, "Room Already Full", res)  
            }
        }       

        if(foundRoom.player1_choices && foundRoom.player2_choices){
            const user1History = await user_game_history.findOne({
                where:{
                    user_game_uuid: foundRoom.player1_uuid
                }
                
            })
            const user2History = await user_game_history.findOne({
                where: {
                    user_game_uuid: foundRoom.player2_uuid
                }
                
            })
            let player1Score = 0
            let player2Score = 0

            for (const index in foundRoom.player1_choices) {
                const player1Choice = foundRoom.player1_choices[index]
                const player2Choice = foundRoom.player2_choices[index]

                const playersChoice = `${player1Choice}${player2Choice}`
                
                switch (playersChoice) {
                    case "ROCKROCK":
                        player1Score += 1
                        player2Score += 1
                        break;
                    case "ROCKPAPER":
                        player2Score += 1
                        break;
                    case "ROCKSCISSOR":
                        player1Score += 1
                        break;
                    case "PAPERROCK":
                        player1Score += 1
                        break;
                    case "PAPERPAPER":
                        player1Score += 1
                        player2Score += 1
                        break;
                    case "PAPERSCISSOR":
                        player2Score += 1
                        break;
                    case "SCISSORROCK":
                        player2Score += 1
                        break;
                    case "SCISSORPAPER":
                        player1Score += 1
                        break;
                    case "SCISSORSCISSOR":
                        player1Score += 1
                        player2Score += 1
                        break;                    
                    default:
                        break;
                }
            }

            if(player1Score > player2Score ){
                await user1History.update({
                    win: Number(user1History.win) + 1
                })
                await user2History.update({
                    lose: Number(user2History.lose) + 1
                })

                await foundRoom.update({
                    winner_uuid: foundRoom.player1_uuid,
                    loser_uuid: foundRoom.player2_uuid,
                    draw: false
                })

                res.status(200).json({
                    message: "PLAYER 1 WIN"
                })
            }else if(player1Score < player2Score){
                await user1History.update({
                    lose: Number(user1History.lose) + 1
                })
                await user2History.update({
                    win: Number(user2History.win) + 1
                })

                await foundRoom.update({
                    winner_uuid: foundRoom.player2_uuid,
                    loser_uuid: foundRoom.player1_uuid,
                    draw: false
                })

                res.status(200).json({
                    message: "PLAYER 2 WIN"
                })
            }else{
                await user1History.update({
                    draw: Number(user1History.draw) + 1
                })
                await user2History.update({
                    draw: Number(user2History.draw) + 1
                })

                await foundRoom.update({
                    draw: true
                })

                res.status(200).json({
                    message: "DRAW"
                })
            }
        }else{
            res.status(200).json({
                message: "Your Choices Recorded, Wait For Other Player To Choose"
            })
        }
    } catch (error) {
        console.log(error)
        return errorHandler(500, error.message, res)  
    }
}


module.exports = {
    RegisterAPI,
    LoginAPI,
    CreateRoom,
    PlayGameRoom
}