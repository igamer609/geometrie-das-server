import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { faker } from "@faker-js/faker"
import request from "supertest"
import { app, db } from "../index.js"

const randomUsername = faker.internet.username().replace(/[^a-zA-Z0-9]/g, "")
const randomPassword = faker.internet.password({length: 12})

// user authentication testing
describe("User Authentication", () => {

  beforeAll(async () => {
    db.query("START TRANSACTION")
  })

  it("Sign up a new user", async () => {
	  const response = await request(app)
	    .post("/users/auth/signup")
	    .send({
		    username: randomUsername,
		    password: randomPassword,
	  }) 

	  expect(response.status).toBe(201) 
	  expect(response.body.success).toBe(true) 
	  expect(response.body).toHaveProperty("id") 
	  expect(response.body).toHaveProperty("token") 

  }) 

  it("Test for duplication error", async () => {
	const response = await request(app)
	  .post("/users/auth/signup")
	  .send({
		username: randomUsername,
		password: randomPassword,
	  }) 

	  expect(response.status).toBe(409) 
	  expect(response.text).toBe("Username is already taken. Please use another one.") 
  }) 

  it("Sign in and return existing user", async () => {
    const response = await request(app)
      .post("/users/auth/signin")
      .send({
        username: randomUsername,
        password: randomPassword,
      }) 
  
    expect(response.status).toBe(201) 
    expect(response.body.success).toBe(true) 
    expect(response.body).toHaveProperty("id") 
    expect(response.body).toHaveProperty("token") 
  }) 
  
  it("Return 404 for missing user", async () => {
    const response = await request(app)
      .post("/users/auth/signin")
      .send({
        username: "nonexistentuser",
        password: "password123",
      }) 
  
    expect(response.status).toBe(404) 
    expect(response.text).toBe("No account with that username was found.") 
  })
}) 

// level management testing
describe("Level Management", () => {
    let token 
  
    beforeAll(async () => {
      const response = await request(app)
        .post("/users/auth/signin")
        .send({
          username: randomUsername,
          password: randomPassword,
        }) 
  
      token = response.body.token 
    })
  
    it("Create new level", async () => {
      const response = await request(app)
        .post("/levels")
        .set("authentication", `Bearer ${token}`)
        .send({
          title: "Test Level",
          description: "This is a test level.",
          song_id: 1,
          length: 120,
          version: "2.0.0-beta.6",
          level_data: "eyJoZWxsbyI6ICJ5YWhoaCEhIiwgInNvbmltY3JpbmUiOiAidGhlIHN1biBpcyBsZWFraW5nIn0=",
        }) 
  
      expect(response.status).toBe(201) 
      expect(response.body.success).toBe(true) 
      expect(response.body).toHaveProperty("id") 
    }) 
  
    it("Deny request to make empty level", async () => {
      const response = await request(app)
        .post("/levels")
        .set("authentication", `Bearer ${token}`)
        .send({
          title: "Incomplete Level",
        }) 
  
      expect(response.status).toBe(400) 
      expect(response.body.success).toBe(false) 
      expect(response.body.errors).toBeInstanceOf(Array) 
    }) 
  

    it("Delete level", async () => {
      const createResponse = await request(app)
       .post("/levels")
        .set("authentication", `Bearer ${token}`)
        .send({
         title: "Level to Delete",
         description: "This level will be deleted.",
         song_id: 1,
         length: 120,
         version: "2.0.0-beta.6",
         level_data: "eyJoZWxsbyI6ICJ5YWhoaCEhIiwgInNvbmltY3JpbmUiOiAidGhlIHN1biBpcyBsZWFraW5nIn0=",
      }) 
  
      const levelId = createResponse.body.id 
  
      const deleteResponse = await request(app)
        .delete(`/levels/${levelId}`)
        .set("authentication", `Bearer ${token}`) 
  
      expect(deleteResponse.status).toBe(200) 
      expect(deleteResponse.body.success).toBe(true) 
  })
})

describe("Social Interactions", () => {
    let token 
    let levelId
  
    beforeAll(async () => {
      const authResponse = await request(app)
        .post("/users/auth/signin")
        .send({
          username: randomUsername,
          password: randomPassword,
        }) 
  
      token = authResponse.body.token 

      const publishResponse = await request(app)
        .post("/levels")
        .set("authentication", `Bearer ${token}`)
        .send({
          title: "Level for Social Testing",
          description: "This level is used for testing social interactions.",
          song_id: 1,
          length: 120,
          version: "2.0.0-beta.6",
          level_data: "eyJoZWxsbyI6ICJ5YWhoaCEhIiwgInNvbmltY3JpbmUiOiAidGhlIHN1biBpcyBsZWFraW5nIn0=",
        }) 
  
      levelId = publishResponse.body.id 
    })

    afterAll(async () => {
      db.query("ROLLBACK")
    })
  
    it("Rate a level", async () => {
      const response = await request(app)
        .post(`/social/rate/${levelId}`)
        .set("authentication", `Bearer ${token}`)
        .send({
          rating: 8,
        })
  
      expect(response.status).toBe(200) 
      expect(response.body.success).toBe(true) 
    })
})