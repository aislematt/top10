"""initial

Revision ID: 6202494bf137
Revises: 
Create Date: 2017-12-04 15:47:30.040519

"""

# revision identifiers, used by Alembic.
revision = '6202494bf137'
down_revision = None
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('list',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('user_id', sa.String(), nullable=True),
    sa.Column('user_name', sa.String(), nullable=True),
    sa.Column('image', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('listitem',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('list_id', sa.Integer(), nullable=True),
    sa.Column('rank', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('body', sa.String(), nullable=True),
    sa.Column('image', sa.String(), nullable=True),
    sa.Column('yt_video', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['list_id'], ['list.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('listitem')
    op.drop_table('list')
    # ### end Alembic commands ###