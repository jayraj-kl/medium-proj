import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@jxty07/medium-common";

export const bookRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
      },
      Variables: {
        userId: any;
      }
}>();

bookRouter.use('/*', async(c, next) => {
  const token = c.req.header("Authorization") || "";
  const user = await verify(token, c.env.JWT_SECRET);
  if (user) {
    c.set('userId', user.id);
    await next()
	} else {
    c.status(401);
		return c.json({ error: "unauthorized" });
  }
})

bookRouter.post('/', async(c) => {
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body)
  if(!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct"
    })
  }
  const authorId = c.get("userId")
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId
      }
    });
    return c.json({
      id: post.id
    })
  } catch(err) {
    c.status(411);
    console.log(err)
    return c.json({
      message: "Invalid"
    })
  }

})

bookRouter.put('/', async(c) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body)
  if(!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct"
    })
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const post = await prisma.post.update({
      where: {
        id: body.id
      },
      data: {
        title: body.title,
        content: body.content
      }
    })
    return c.json({
      id: post.id
    })
  } catch (err) {
    c.status(411);
    return c.json({
      message: "Invalid"
    })
  }

})

// pagination to be added later
bookRouter.get('/bulk', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try {
    const post = await prisma.post.findMany()
    return c.json({
      post
    }) 
  } catch(err) {
    c.status(411);
    return c.json({
      message: "Invalid"
    })
  }
})

bookRouter.get('/:id', async(c) => {
  const id = c.req.param("id")
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: id
      }
    })
    return c.json({
      post
    }) 
  } catch(err) {
    c.status(411);
    return c.json({
      message: "Invalid"
    })
  }
})
