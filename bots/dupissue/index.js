module.exports = app => {
	app.on('issues.opened', async context => {
		const title = context.payload.issue.title
		const number = context.payload.issue.number
		const issue = (await context.github.issues.listForRepo({
			owner: 'DimiDimit',
			repo: 'test',
			state: 'all',
		})).data.find(issue => issue.number !== number && issue.title === title)
		if (issue) {
			await context.github.issues.createComment(
				context.issue({ body: `Duplicate of #${issue.number}` })
			)
			await context.github.issues.update({
				owner: 'DimiDimit',
				repo: 'test',
				issue_number: number,
				state: 'closed',
				labels: ['duplicate'],
			})
		}
	})
}
